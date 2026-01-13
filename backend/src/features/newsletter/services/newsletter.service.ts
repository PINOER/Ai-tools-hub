import { prisma } from '@config/index.ts';
import {
  Newsletter,
  NewsletterStatus,
  NewsletterFrequency,
  WeekDay,
  SendMode,
  NewsletterTemplateContent,
  FallbackContent,
} from '@prisma/client';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class NewsletterService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }
  async createNewsletter(
    data: {
      subject: string;
      template: string;
      frequency?: NewsletterFrequency;
      send_day?: WeekDay;
      send_time?: string;
      start_date?: string;
      is_enabled?: boolean;
      send_mode?: SendMode;
      template_type?: NewsletterTemplateContent;
      fallback_type?: FallbackContent;
    },
    user_id: number
  ): Promise<Newsletter> {
    // Parse send_time to DateTime if provided
    let sendTime: Date | undefined;
    if (data.send_time) {
      const [hours, minutes] = data.send_time.split(':').map(Number);
      sendTime = new Date();
      sendTime.setHours(hours, minutes, 0, 0);
    }

    // Parse start_date if provided
    let startDate: Date | undefined;
    if (data.start_date) {
      startDate = new Date(data.start_date);
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        ...data,
        send_time: sendTime,
        start_date: startDate,
        status: NewsletterStatus.Draft,
      },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Newsletter Created',
      description: `Newsletter "${newsletter.subject}" created`,
      icon: '📧',
      user_id: user_id,
      entity_type: 'newsletter',
      entity_name: newsletter.subject,
    });

    return newsletter;
  }

  async updateNewsletter(
    id: number,
    data: {
      subject?: string;
      template?: string;
      frequency?: NewsletterFrequency;
      send_day?: WeekDay;
      send_time?: string;
      start_date?: string;
      is_enabled?: boolean;
      send_mode?: SendMode;
      template_type?: NewsletterTemplateContent;
      fallback_type?: FallbackContent;
    },
    user_id: number
  ): Promise<Newsletter> {
    // Parse send_time to DateTime if provided
    let sendTime: Date | undefined;
    if (data.send_time) {
      const [hours, minutes] = data.send_time.split(':').map(Number);
      sendTime = new Date();
      sendTime.setHours(hours, minutes, 0, 0);
    }

    // Parse start_date if provided
    let startDate: Date | undefined;
    if (data.start_date) {
      startDate = new Date(data.start_date);
    }

    const newsletter = await prisma.newsletter.update({
      where: { id },
      data: {
        ...data,
        send_time: sendTime,
        start_date: startDate,
      },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Newsletter Updated',
      description: `Newsletter "${newsletter.subject}" updated`,
      icon: '✏️',
      user_id: user_id,
      entity_type: 'newsletter',
      entity_name: newsletter.subject,
    });

    return newsletter;
  }

  async deleteNewsletter(id: number, user_id: number): Promise<Newsletter> {
    // Get newsletter info before deletion for activity logging
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      select: { subject: true },
    });

    const deletedNewsletter = await prisma.newsletter.delete({
      where: { id },
    });

    // Log activity
    if (newsletter) {
      await this.activityService.logActivity({
        title: 'Newsletter Deleted',
        description: `Newsletter "${newsletter.subject}" deleted`,
        icon: '🗑️',
        user_id: user_id,
        entity_type: 'newsletter',
        entity_name: newsletter.subject,
      });
    }

    return deletedNewsletter;
  }

  async getNewsletter(id: number): Promise<Newsletter | null> {
    return await prisma.newsletter.findUnique({
      where: { id },
    });
  }

  async getNewsletters(
    page: number = 1,
    limit: number = 10,
    filters?: {
      status?: NewsletterStatus;
      frequency?: NewsletterFrequency;
      send_day?: WeekDay;
      send_mode?: SendMode;
      template_type?: NewsletterTemplateContent;
      fallback_type?: FallbackContent;
      is_enabled?: boolean;
      search?: string;
      start_date_from?: Date;
      start_date_to?: Date;
      created_date_from?: Date;
      created_date_to?: Date;
    },
    sortBy?: {
      field: 'subject' | 'status' | 'frequency' | 'start_date' | 'created_at' | 'updated_at';
      order: 'asc' | 'desc';
    }
  ): Promise<{ newsletters: Newsletter[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const whereClause: any = {};

    if (filters?.status) {
      whereClause.status = filters.status;
    }

    if (filters?.frequency) {
      whereClause.frequency = filters.frequency;
    }

    if (filters?.send_day) {
      whereClause.send_day = filters.send_day;
    }

    if (filters?.send_mode) {
      whereClause.send_mode = filters.send_mode;
    }

    if (filters?.template_type) {
      whereClause.template_type = filters.template_type;
    }

    if (filters?.fallback_type) {
      whereClause.fallback_type = filters.fallback_type;
    }

    if (filters?.is_enabled !== undefined) {
      whereClause.is_enabled = filters.is_enabled;
    }

    // Search in subject and template
    if (filters?.search) {
      whereClause.OR = [
        {
          subject: {
            contains: filters.search,
            mode: 'insensitive' as any,
          },
        },
        {
          template: {
            contains: filters.search,
            mode: 'insensitive' as any,
          },
        },
      ];
    }

    // Date range filters
    if (filters?.start_date_from || filters?.start_date_to) {
      whereClause.start_date = {};
      if (filters.start_date_from) {
        whereClause.start_date.gte = filters.start_date_from;
      }
      if (filters.start_date_to) {
        whereClause.start_date.lte = filters.start_date_to;
      }
    }

    if (filters?.created_date_from || filters?.created_date_to) {
      whereClause.created_at = {};
      if (filters.created_date_from) {
        whereClause.created_at.gte = filters.created_date_from;
      }
      if (filters.created_date_to) {
        whereClause.created_at.lte = filters.created_date_to;
      }
    }

    // Build order by clause
    let orderBy: any;
    if (sortBy) {
      orderBy = { [sortBy.field]: sortBy.order };
    } else {
      orderBy = { created_at: 'desc' };
    }

    const [newsletters, total] = await Promise.all([
      prisma.newsletter.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy,
        include: {
          engagements: {
            select: {
              id: true,
              opened: true,
              clicked: true,
            },
          },
        },
      }),
      prisma.newsletter.count({ where: whereClause }),
    ]);

    return { newsletters, total };
  }

  async scheduleNewsletter(id: number): Promise<Newsletter> {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
    });

    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    if (newsletter.status !== NewsletterStatus.Draft) {
      throw new Error('Only draft newsletters can be scheduled');
    }

    // Calculate next send time based on frequency and settings
    const nextSendTime = this.calculateNextSendTime(newsletter);

    return await prisma.newsletter.update({
      where: { id },
      data: {
        status: NewsletterStatus.Scheduled,
        start_date: nextSendTime,
      },
    });
  }

  async cancelNewsletter(id: number): Promise<Newsletter> {
    return await prisma.newsletter.update({
      where: { id },
      data: {
        status: NewsletterStatus.Cancelled,
      },
    });
  }

  // Core scheduling logic
  private calculateNextSendTime(newsletter: Newsletter): Date {
    const now = new Date();
    let nextSendTime = new Date(now);

    // If start_date is in the future, use that as base
    if (newsletter.start_date && newsletter.start_date > now) {
      nextSendTime = new Date(newsletter.start_date);
    }

    // Apply frequency-based scheduling
    switch (newsletter.frequency) {
      case NewsletterFrequency.Daily:
        // Set to next day at send_time
        if (newsletter.send_time) {
          const [hours, minutes] = newsletter.send_time.toTimeString().split(':').map(Number);
          nextSendTime.setDate(nextSendTime.getDate() + 1);
          nextSendTime.setHours(hours, minutes, 0, 0);
        }
        break;

      case NewsletterFrequency.Weekly:
        // Set to next specified weekday
        if (newsletter.send_day) {
          const targetDay = this.getDayNumber(newsletter.send_day);
          const currentDay = nextSendTime.getDay();
          let daysToAdd = targetDay - currentDay;

          if (daysToAdd <= 0) {
            daysToAdd += 7; // Next week
          }

          nextSendTime.setDate(nextSendTime.getDate() + daysToAdd);

          if (newsletter.send_time) {
            const [hours, minutes] = newsletter.send_time.toTimeString().split(':').map(Number);
            nextSendTime.setHours(hours, minutes, 0, 0);
          }
        }
        break;

      case NewsletterFrequency.Monthly:
        // Set to same day next month
        nextSendTime.setMonth(nextSendTime.getMonth() + 1);
        if (newsletter.send_time) {
          const [hours, minutes] = newsletter.send_time.toTimeString().split(':').map(Number);
          nextSendTime.setHours(hours, minutes, 0, 0);
        }
        break;

      case NewsletterFrequency.Custom:
        // For custom, just use the start_date as is
        if (newsletter.start_date) {
          nextSendTime = new Date(newsletter.start_date);
        }
        break;
    }

    return nextSendTime;
  }

  private getDayNumber(day: WeekDay): number {
    const dayMap: Record<WeekDay, number> = {
      [WeekDay.Sunday]: 0,
      [WeekDay.Monday]: 1,
      [WeekDay.Tuesday]: 2,
      [WeekDay.Wednesday]: 3,
      [WeekDay.Thursday]: 4,
      [WeekDay.Friday]: 5,
      [WeekDay.Saturday]: 6,
    };
    return dayMap[day];
  }

  // Method to check and process scheduled newsletters
  async processScheduledNewsletters(): Promise<void> {
    const now = new Date();

    // Find newsletters that should be sent now
    const newslettersToSend = await prisma.newsletter.findMany({
      where: {
        status: NewsletterStatus.Scheduled,
        is_enabled: true,
        start_date: {
          lte: now,
        },
      },
    });

    for (const newsletter of newslettersToSend) {
      try {
        // Send newsletter logic would go here
        // For now, just mark as sent
        await prisma.newsletter.update({
          where: { id: newsletter.id },
          data: {
            status: NewsletterStatus.Sent,
          },
        });

        // Log activity
        await this.activityService.logActivity({
          title: 'Newsletter Sent',
          description: `Newsletter sent to subscribers`,
          icon: '📧',
          user_id: 1, // System user for automated actions
          entity_type: 'newsletter',
          entity_name: newsletter.subject,
        });

        // Schedule next send if it's recurring
        if (newsletter.frequency !== NewsletterFrequency.Custom) {
          const nextSendTime = this.calculateNextSendTime(newsletter);
          await prisma.newsletter.update({
            where: { id: newsletter.id },
            data: {
              start_date: nextSendTime,
              status: NewsletterStatus.Scheduled,
            },
          });
        }
      } catch {
        // Mark as failed
        await prisma.newsletter.update({
          where: { id: newsletter.id },
          data: {
            status: NewsletterStatus.Failed,
          },
        });
      }
    }
  }

  // Utility method to get newsletters ready for sending
  async getReadyToSendNewsletters(): Promise<Newsletter[]> {
    const now = new Date();

    return await prisma.newsletter.findMany({
      where: {
        status: NewsletterStatus.Scheduled,
        is_enabled: true,
        start_date: {
          lte: now,
        },
      },
    });
  }

  // Analytics methods
  async getNewsletterAnalytics(id: number) {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      include: {
        engagements: true,
      },
    });

    if (!newsletter) {
      throw new Error('Newsletter not found');
    }

    const totalEngagements = newsletter.engagements.length;
    const openedCount = newsletter.engagements.filter((e) => e.opened).length;
    const clickedCount = newsletter.engagements.filter((e) => e.clicked).length;

    return {
      id: newsletter.id,
      subject: newsletter.subject,
      status: newsletter.status,
      sentAt: newsletter.start_date,
      totalEngagements,
      openedCount,
      clickedCount,
      openRate: totalEngagements > 0 ? (openedCount / totalEngagements) * 100 : 0,
      clickRate: totalEngagements > 0 ? (clickedCount / totalEngagements) * 100 : 0,
      clickToOpenRate: openedCount > 0 ? (clickedCount / openedCount) * 100 : 0,
    };
  }

  async getNewsletterPerformanceMetrics(
    frequency?: NewsletterFrequency,
    startDate?: Date,
    endDate?: Date
  ) {
    const whereClause: any = {};

    if (frequency) {
      whereClause.frequency = frequency;
    }

    if (startDate || endDate) {
      whereClause.start_date = {};
      if (startDate) whereClause.start_date.gte = startDate;
      if (endDate) whereClause.start_date.lte = endDate;
    }

    const newsletters = await prisma.newsletter.findMany({
      where: whereClause,
      include: {
        engagements: true,
      },
    });

    const totalNewsletters = newsletters.length;
    const totalEngagements = newsletters.reduce((sum, n) => sum + n.engagements.length, 0);
    const totalOpened = newsletters.reduce(
      (sum, n) => sum + n.engagements.filter((e) => e.opened).length,
      0
    );
    const totalClicked = newsletters.reduce(
      (sum, n) => sum + n.engagements.filter((e) => e.clicked).length,
      0
    );

    return {
      totalNewsletters,
      totalEngagements,
      totalOpened,
      totalClicked,
      averageOpenRate: totalEngagements > 0 ? (totalOpened / totalEngagements) * 100 : 0,
      averageClickRate: totalEngagements > 0 ? (totalClicked / totalEngagements) * 100 : 0,
      averageClickToOpenRate: totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0,
    };
  }

  async getNewsletterEngagementTrends(days: number = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const newsletters = await prisma.newsletter.findMany({
      where: {
        start_date: {
          gte: startDate,
          lte: endDate,
        },
        status: NewsletterStatus.Sent,
      },
      include: {
        engagements: true,
      },
      orderBy: {
        start_date: 'asc',
      },
    });

    // Group by date and calculate daily metrics
    const dailyMetrics = newsletters.reduce(
      (acc, newsletter) => {
        const date = newsletter.start_date?.toISOString().split('T')[0] || 'unknown';

        if (!acc[date]) {
          acc[date] = {
            date,
            newslettersSent: 0,
            totalEngagements: 0,
            openedCount: 0,
            clickedCount: 0,
          };
        }

        acc[date].newslettersSent++;
        acc[date].totalEngagements += newsletter.engagements.length;
        acc[date].openedCount += newsletter.engagements.filter((e) => e.opened).length;
        acc[date].clickedCount += newsletter.engagements.filter((e) => e.clicked).length;

        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(dailyMetrics).map((metrics) => ({
      ...metrics,
      openRate:
        metrics.totalEngagements > 0 ? (metrics.openedCount / metrics.totalEngagements) * 100 : 0,
      clickRate:
        metrics.totalEngagements > 0 ? (metrics.clickedCount / metrics.totalEngagements) * 100 : 0,
    }));
  }

  async getTopPerformingNewsletters(limit: number = 10) {
    const newsletters = await prisma.newsletter.findMany({
      where: {
        status: NewsletterStatus.Sent,
      },
      include: {
        engagements: true,
      },
      orderBy: {
        start_date: 'desc',
      },
      take: limit,
    });

    return newsletters
      .map((newsletter) => {
        const totalEngagements = newsletter.engagements.length;
        const openedCount = newsletter.engagements.filter((e) => e.opened).length;
        const clickedCount = newsletter.engagements.filter((e) => e.clicked).length;

        return {
          id: newsletter.id,
          subject: newsletter.subject,
          sentAt: newsletter.start_date,
          totalEngagements,
          openedCount,
          clickedCount,
          openRate: totalEngagements > 0 ? (openedCount / totalEngagements) * 100 : 0,
          clickRate: totalEngagements > 0 ? (clickedCount / totalEngagements) * 100 : 0,
        };
      })
      .sort((a, b) => b.openRate - a.openRate);
  }
}
