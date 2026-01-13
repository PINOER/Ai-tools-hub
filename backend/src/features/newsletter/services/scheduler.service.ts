import { NewsletterService } from './newsletter.service.js';
import logger from '@utils/logger.js';
import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

interface NewsletterJobData {
  newsletterId: number;
  scheduledTime: Date;
  frequency: string;
  sendDay?: string;
  sendTime?: string;
}

export class NewsletterSchedulerService {
  private queue: Queue;
  private worker: Worker;
  private redis: Redis;
  private isRunning = false;

  constructor(private newsletterService: NewsletterService) {
    // Initialize Redis connection
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });

    // Initialize BullMQ components
    this.queue = new Queue('newsletter-queue', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    this.worker = new Worker(
      'newsletter-queue',
      async (job: Job<NewsletterJobData>) => {
        await this.processNewsletterJob(job);
      },
      {
        connection: this.redis,
        concurrency: 5, // Process up to 5 newsletters concurrently
      }
    );

    // Handle worker events
    this.worker.on('completed', (job) => {
      logger.info(`Newsletter job ${job.id} completed successfully`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`Newsletter job ${job?.id} failed:`, err);
    });

    this.worker.on('error', (err) => {
      logger.error('Newsletter worker error:', err);
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.info('Newsletter scheduler is already running');
      return;
    }

    try {
      // Test Redis connection
      await this.redis.ping();
      logger.info('Redis connection established');

      this.isRunning = true;
      logger.info('Newsletter scheduler started with BullMQ queue system');

      // Process any existing scheduled newsletters
      await this.scheduleExistingNewsletters();
    } catch (error) {
      logger.error('Failed to start newsletter scheduler:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      await this.worker.close();
      await this.queue.close();
      await this.redis.quit();

      this.isRunning = false;
      logger.info('Newsletter scheduler stopped');
    } catch (error) {
      logger.error('Error stopping newsletter scheduler:', error);
    }
  }

  /**
   * Schedule a newsletter for sending
   */
  async scheduleNewsletter(
    newsletterId: number,
    scheduledTime: Date,
    frequency: string,
    sendDay?: string,
    sendTime?: string
  ): Promise<void> {
    try {
      const delay = scheduledTime.getTime() - Date.now();

      if (delay <= 0) {
        // If the time has already passed, process immediately
        await this.processNewsletterJob({
          data: { newsletterId, scheduledTime, frequency, sendDay, sendTime },
          id: `immediate-${newsletterId}`,
        } as Job<NewsletterJobData>);
        return;
      }

      await this.queue.add(
        `newsletter-${newsletterId}`,
        { newsletterId, scheduledTime, frequency, sendDay, sendTime },
        {
          delay,
          jobId: `newsletter-${newsletterId}-${scheduledTime.getTime()}`,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        }
      );

      logger.info(`Newsletter ${newsletterId} scheduled for ${scheduledTime.toISOString()}`);
    } catch (error) {
      logger.error(`Failed to schedule newsletter ${newsletterId}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled newsletter
   */
  async cancelNewsletter(newsletterId: number): Promise<void> {
    try {
      const jobs = await this.queue.getJobs(['delayed', 'waiting']);
      const newsletterJobs = jobs.filter((job) => job.data.newsletterId === newsletterId);

      for (const job of newsletterJobs) {
        await job.remove();
        logger.info(`Cancelled newsletter job ${job.id}`);
      }
    } catch (error) {
      logger.error(`Failed to cancel newsletter ${newsletterId}:`, error);
      throw error;
    }
  }

  /**
   * Process a newsletter job
   */
  private async processNewsletterJob(job: Job<NewsletterJobData>): Promise<void> {
    const { newsletterId, frequency, sendDay, sendTime } = job.data;

    try {
      logger.info(`Processing newsletter ${newsletterId}`);

      // Send the newsletter (implement your sending logic here)
      await this.newsletterService.processScheduledNewsletters();

      // If it's a recurring newsletter, schedule the next one
      if (frequency !== 'Custom') {
        const nextScheduledTime = this.calculateNextScheduledTime(frequency, sendDay, sendTime);
        if (nextScheduledTime) {
          await this.scheduleNewsletter(
            newsletterId,
            nextScheduledTime,
            frequency,
            sendDay,
            sendTime
          );
        }
      }

      logger.info(`Newsletter ${newsletterId} processed successfully`);
    } catch (error) {
      logger.error(`Failed to process newsletter ${newsletterId}:`, error);
      throw error;
    }
  }

  /**
   * Calculate the next scheduled time for recurring newsletters
   */
  private calculateNextScheduledTime(
    frequency: string,
    sendDay?: string,
    sendTime?: string
  ): Date | null {
    const now = new Date();
    const nextTime = new Date(now);

    switch (frequency) {
      case 'Daily':
        nextTime.setDate(nextTime.getDate() + 1);
        break;
      case 'Weekly':
        if (sendDay) {
          const targetDay = this.getDayNumber(sendDay);
          const currentDay = nextTime.getDay();
          let daysToAdd = targetDay - currentDay;

          if (daysToAdd <= 0) {
            daysToAdd += 7; // Next week
          }

          nextTime.setDate(nextTime.getDate() + daysToAdd);
        }
        break;
      case 'Monthly':
        nextTime.setMonth(nextTime.getMonth() + 1);
        break;
      default:
        return null;
    }

    // Set the time if specified
    if (sendTime) {
      const [hours, minutes] = sendTime.split(':').map(Number);
      nextTime.setHours(hours, minutes, 0, 0);
    }

    return nextTime;
  }

  private getDayNumber(day: string): number {
    const dayMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    return dayMap[day] || 0;
  }

  /**
   * Schedule existing newsletters that are already in the database
   */
  private async scheduleExistingNewsletters(): Promise<void> {
    try {
      const scheduledNewsletters = await this.newsletterService.getReadyToSendNewsletters();

      for (const newsletter of scheduledNewsletters) {
        if (newsletter.start_date && newsletter.start_date > new Date()) {
          await this.scheduleNewsletter(
            newsletter.id,
            newsletter.start_date,
            newsletter.frequency,
            newsletter.send_day || undefined,
            newsletter.send_time?.toTimeString().slice(0, 5)
          );
        }
      }

      logger.info(`Scheduled ${scheduledNewsletters.length} existing newsletters`);
    } catch (error) {
      logger.error('Failed to schedule existing newsletters:', error);
    }
  }

  /**
   * Get scheduler status
   */
  async getStatus(): Promise<{ isRunning: boolean; queueStats: any }> {
    try {
      const waiting = await this.queue.getWaiting();
      const delayed = await this.queue.getDelayed();
      const active = await this.queue.getActive();
      const completed = await this.queue.getCompleted();
      const failed = await this.queue.getFailed();

      return {
        isRunning: this.isRunning,
        queueStats: {
          waiting: waiting.length,
          delayed: delayed.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
        },
      };
    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      return {
        isRunning: this.isRunning,
        queueStats: { error: 'Failed to fetch stats' },
      };
    }
  }

  /**
   * Manually trigger processing (for testing/debugging)
   */
  async triggerProcessing(): Promise<void> {
    try {
      const readyNewsletters = await this.newsletterService.getReadyToSendNewsletters();

      for (const newsletter of readyNewsletters) {
        await this.processNewsletterJob({
          data: {
            newsletterId: newsletter.id,
            scheduledTime: new Date(),
            frequency: newsletter.frequency,
            sendDay: newsletter.send_day || undefined,
            sendTime: newsletter.send_time?.toTimeString().slice(0, 5),
          },
          id: `manual-${newsletter.id}`,
        } as Job<NewsletterJobData>);
      }

      logger.info(`Manually processed ${readyNewsletters.length} newsletters`);
    } catch (error) {
      logger.error('Manual processing failed:', error);
      throw error;
    }
  }
}
