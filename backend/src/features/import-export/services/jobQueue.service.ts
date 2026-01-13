import Queue from 'bull';
import { PrismaClient } from '@prisma/client';
import { EntityType, ImportExportStatus } from '@prisma/client';
import { WorkerThreadService } from './workerThread.service.ts';
import logger from '../../../utils/logger.ts';

export class JobQueueService {
  private importQueue: Queue.Queue;
  private exportQueue: Queue.Queue;
  private prisma: PrismaClient;
  private workerThreadService: WorkerThreadService;
  private importProcessor?: (
    jobId: string,
    entityType: EntityType,
    filePath: string,
    options: any
  ) => Promise<void>;
  private exportProcessor?: (
    jobId: string,
    entityType: EntityType,
    filters: any,
    options: any
  ) => Promise<void>;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.workerThreadService = new WorkerThreadService();

    // Create import queue
    this.importQueue = new Queue('import-jobs', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
        jobId: undefined, // Allow Bull to generate job IDs
      },
      settings: {
        stalledInterval: 30000, // Check for stalled jobs every 30 seconds
        maxStalledCount: 1, // Mark job as failed after 1 stall
      },
    });

    // Create export queue
    this.exportQueue = new Queue('export-jobs', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
        jobId: undefined, // Allow Bull to generate job IDs
      },
      settings: {
        stalledInterval: 30000, // Check for stalled jobs every 30 seconds
        maxStalledCount: 1, // Mark job as failed after 1 stall
      },
    });

    // Monitor queue health
    this.monitorQueues();
  }

  /**
   * Monitor queue health and performance
   */
  private monitorQueues() {
    // Monitor import queue
    this.importQueue.on('error', (error) => {
      logger.error('Import queue error:', error);
    });

    this.importQueue.on('waiting', (jobId) => {
      logger.info(`Import job ${jobId} waiting in queue`);
    });

    this.importQueue.on('active', (job) => {
      logger.info(`Import job ${job.id} started processing`);
    });

    // Monitor export queue
    this.exportQueue.on('error', (error) => {
      logger.error('Export queue error:', error);
    });

    this.exportQueue.on('waiting', (jobId) => {
      logger.info(`Export job ${jobId} waiting in queue`);
    });

    this.exportQueue.on('active', (job) => {
      logger.info(`Export job ${job.id} started processing`);
    });

    // Log queue status periodically
    setInterval(async () => {
      try {
        const [importWaiting, importActive, exportWaiting, exportActive] = await Promise.all([
          this.importQueue.getWaiting(),
          this.importQueue.getActive(),
          this.exportQueue.getWaiting(),
          this.exportQueue.getActive(),
        ]);

        if (
          importWaiting.length > 0 ||
          importActive.length > 0 ||
          exportWaiting.length > 0 ||
          exportActive.length > 0
        ) {
          logger.info(
            `Queue status - Import: ${importWaiting.length} waiting, ${importActive.length} active; Export: ${exportWaiting.length} waiting, ${exportActive.length} active`
          );
        }
      } catch (error) {
        logger.error('Failed to get queue status:', error);
      }
    }, 60000); // Log every minute
  }

  /**
   * Set the processor functions for import and export jobs
   */
  setProcessors(
    importProcessor: (
      jobId: string,
      entityType: EntityType,
      filePath: string,
      options: any
    ) => Promise<void>,
    exportProcessor: (
      jobId: string,
      entityType: EntityType,
      filters: any,
      options: any
    ) => Promise<void>
  ) {
    this.importProcessor = importProcessor;
    this.exportProcessor = exportProcessor;
  }

  async addImportJob(
    jobId: string,
    entityType: EntityType,
    filePath: string,
    options: any,
    adminId: number
  ) {
    logger.info(`Adding import job ${jobId} to queue`);

    const job = await this.importQueue.add(
      'import',
      {
        jobId,
        entityType,
        filePath,
        options,
        adminId,
      },
      {
        priority: options?.priority || 0,
        delay: options?.delay || 0,
        jobId: jobId,
      }
    );

    logger.info(`Import job ${jobId} added to queue successfully`);
    return job;
  }

  async addExportJob(jobId: string, entityType: EntityType, adminId: number) {
    const job = await this.exportQueue.add('export', {
      jobId,
      entityType,
      adminId,
    });

    logger.info(`Export job ${jobId} added to queue with job ID: ${job.id}`);
    return job;
  }

  async getQueueStatus() {
    const [importWaiting, importActive, importCompleted, importFailed] = await Promise.all([
      this.importQueue.getWaiting(),
      this.importQueue.getActive(),
      this.importQueue.getCompleted(),
      this.importQueue.getFailed(),
    ]);

    const [exportWaiting, exportActive, exportCompleted, exportFailed] = await Promise.all([
      this.exportQueue.getWaiting(),
      this.exportQueue.getActive(),
      this.exportQueue.getCompleted(),
      this.exportQueue.getFailed(),
    ]);

    return {
      import: {
        waiting: importWaiting.length,
        active: importActive.length,
        completed: importCompleted.length,
        failed: importFailed.length,
      },
      export: {
        waiting: exportWaiting.length,
        active: exportActive.length,
        completed: exportCompleted.length,
        failed: exportFailed.length,
      },
    };
  }

  async getJobDetails(queueName: 'import' | 'export', jobId: string) {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    const job = await queue.getJob(jobId);

    if (!job) {
      return null;
    }

    return {
      id: job.id,
      data: job.data,
      progress: job.progress(),
      status: await job.getState(),
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
    };
  }

  async cancelJob(queueName: 'import' | 'export', jobId: string) {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    await job.remove();
    await this.updateJobStatus(jobId, 'Cancelled' as ImportExportStatus, 'Job cancelled by user');

    logger.info(`Job ${jobId} cancelled successfully`);
    return true;
  }

  async retryJob(queueName: 'import' | 'export', jobId: string) {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    const job = await queue.getJob(jobId);

    if (!job) {
      throw new Error('Job not found');
    }

    if ((await job.getState()) !== 'failed') {
      throw new Error('Only failed jobs can be retried');
    }

    await job.retry();
    await this.updateJobStatus(jobId, 'Pending' as ImportExportStatus, 'Job retry initiated');

    logger.info(`Job ${jobId} retry initiated`);
    return true;
  }

  async pauseQueue(queueName: 'import' | 'export') {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    await queue.pause();
    logger.info(`${queueName} queue paused`);
  }

  async resumeQueue(queueName: 'import' | 'export') {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    await queue.resume();
    logger.info(`${queueName} queue resumed`);
  }

  async cleanQueue(queueName: 'import' | 'export', grace: number = 1000 * 60 * 60 * 24) {
    const queue = queueName === 'import' ? this.importQueue : this.exportQueue;
    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
    logger.info(`${queueName} queue cleaned`);
  }

  private async updateJobStatus(jobId: string, status: ImportExportStatus, message: string) {
    try {
      await this.prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          status,
          errorLogs: message,
          completedAt: status === 'Completed' || status === 'Failed' ? new Date() : null,
        },
      });

      // Progress logging removed - status is updated directly in ImportExportJob
    } catch (error) {
      logger.error(`Failed to update job status for ${jobId}:`, error);
    }
  }

  // Start processing jobs
  startProcessing() {
    // Process import jobs in background with concurrency control
    this.importQueue.process('import', 2, async (job) => {
      logger.info(`Processing import job ${job.id}`);
      const { jobId, entityType, filePath, options } = job.data;

      try {
        // Update job status to processing
        await this.updateJobStatus(
          jobId,
          'Processing' as ImportExportStatus,
          'Starting import process'
        );

        // Report progress
        await job.progress(10);

        // Process the import using the processor function in background
        if (this.importProcessor) {
          logger.info(`Executing import processor for job ${jobId}`);
          await this.importProcessor(jobId, entityType, filePath, options);
          logger.info(`Import processor completed for job ${jobId}`);
        } else {
          logger.error('Import processor not set!');
          throw new Error('Import processor not set');
        }

        // Report completion
        await job.progress(100);

        logger.info(`Import job ${jobId} processed successfully`);
      } catch (error) {
        logger.error(`Import job ${jobId} processing failed:`, error);
        throw error;
      }
    });

    // Process export jobs in background with concurrency control
    this.exportQueue.process('export', 2, async (job) => {
      const { jobId, entityType, filters, options } = job.data;

      try {
        // Update job status to processing
        await this.updateJobStatus(
          jobId,
          'Processing' as ImportExportStatus,
          'Starting export process'
        );

        // Report progress
        await job.progress(10);

        // Process the export using the processor function in background
        if (this.exportProcessor) {
          await this.exportProcessor(jobId, entityType, filters, options);
        } else {
          throw new Error('Export processor not set');
        }

        // Report completion
        await job.progress(100);

        logger.info(`Export job ${jobId} processed successfully`);
      } catch (error) {
        logger.error(`Export job ${jobId} processing failed:`, error);
        throw error;
      }
    });

    logger.info(
      'Import/Export job queues started processing in background with concurrency control'
    );
  }

  // Graceful shutdown
  async shutdown() {
    await this.importQueue.close();
    await this.exportQueue.close();
    logger.info('Import/Export job queues shut down gracefully');
  }
}
