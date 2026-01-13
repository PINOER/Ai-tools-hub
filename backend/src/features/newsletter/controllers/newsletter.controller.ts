import { Request, Response } from 'express';
import { NewsletterService } from '../services/newsletter.service.js';
import { NewsletterSchedulerService } from '../services/scheduler.service.js';

export class NewsletterController {
  private schedulerService: NewsletterSchedulerService;

  constructor(private newsletterService: NewsletterService) {
    this.schedulerService = new NewsletterSchedulerService(newsletterService);
  }

  async createNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const newsletter = await this.newsletterService.createNewsletter(
        req.validatedBody,
        req.user!.id
      );
      res.status(201).json({
        success: true,
        data: newsletter,
        message: 'Newsletter created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create newsletter',
      });
    }
  }

  async updateNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const newsletter = await this.newsletterService.updateNewsletter(
        id,
        req.validatedBody,
        req.user!.id
      );
      res.json({
        success: true,
        data: newsletter,
        message: 'Newsletter updated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update newsletter',
      });
    }
  }

  async deleteNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const newsletter = await this.newsletterService.deleteNewsletter(id, req.user!.id);
      res.json({
        success: true,
        data: newsletter,
        message: 'Newsletter deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete newsletter',
      });
    }
  }

  async getNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const newsletter = await this.newsletterService.getNewsletter(id);

      if (!newsletter) {
        res.status(404).json({
          success: false,
          message: 'Newsletter not found',
        });
        return;
      }

      res.json({
        success: true,
        data: newsletter,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get newsletter',
      });
    }
  }

  async getNewsletters(req: Request, res: Response): Promise<void> {
    try {
      const page = req.validatedQuery?.page || 1;
      const limit = req.validatedQuery?.limit || 10;

      // Extract filter parameters
      const filters = {
        status: req.validatedQuery?.status,
        frequency: req.validatedQuery?.frequency,
        send_day: req.validatedQuery?.send_day,
        send_mode: req.validatedQuery?.send_mode,
        template_type: req.validatedQuery?.template_type,
        fallback_type: req.validatedQuery?.fallback_type,
        is_enabled: req.validatedQuery?.is_enabled,
        search: req.validatedQuery?.search,
        start_date_from: req.validatedQuery?.start_date_from
          ? new Date(req.validatedQuery.start_date_from)
          : undefined,
        start_date_to: req.validatedQuery?.start_date_to
          ? new Date(req.validatedQuery.start_date_to)
          : undefined,
        created_date_from: req.validatedQuery?.created_date_from
          ? new Date(req.validatedQuery.created_date_from)
          : undefined,
        created_date_to: req.validatedQuery?.created_date_to
          ? new Date(req.validatedQuery.created_date_to)
          : undefined,
      };

      // Extract sorting parameters
      const sortBy =
        req.validatedQuery?.sort_by && req.validatedQuery?.sort_order
          ? {
              field: req.validatedQuery.sort_by as
                | 'subject'
                | 'status'
                | 'frequency'
                | 'start_date'
                | 'created_at'
                | 'updated_at',
              order: req.validatedQuery.sort_order as 'asc' | 'desc',
            }
          : undefined;

      const result = await this.newsletterService.getNewsletters(page, limit, filters, sortBy);

      res.json({
        success: true,
        data: result.newsletters,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get newsletters',
      });
    }
  }

  async scheduleNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const newsletter = await this.newsletterService.scheduleNewsletter(id);

      res.json({
        success: true,
        data: newsletter,
        message: 'Newsletter scheduled successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to schedule newsletter',
      });
    }
  }

  async cancelNewsletter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const newsletter = await this.newsletterService.cancelNewsletter(id);

      res.json({
        success: true,
        data: newsletter,
        message: 'Newsletter cancelled successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel newsletter',
      });
    }
  }

  async processScheduledNewsletters(req: Request, res: Response): Promise<void> {
    try {
      await this.newsletterService.processScheduledNewsletters();

      res.json({
        success: true,
        message: 'Scheduled newsletters processed successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process scheduled newsletters',
      });
    }
  }

  async getReadyToSendNewsletters(req: Request, res: Response): Promise<void> {
    try {
      const newsletters = await this.newsletterService.getReadyToSendNewsletters();

      res.json({
        success: true,
        data: newsletters,
        count: newsletters.length,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get ready newsletters',
      });
    }
  }

  async startScheduler(req: Request, res: Response): Promise<void> {
    try {
      this.schedulerService.start();

      res.json({
        success: true,
        message: 'Newsletter scheduler started successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to start scheduler',
      });
    }
  }

  async stopScheduler(req: Request, res: Response): Promise<void> {
    try {
      this.schedulerService.stop();

      res.json({
        success: true,
        message: 'Newsletter scheduler stopped successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to stop scheduler',
      });
    }
  }

  async getSchedulerStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = this.schedulerService.getStatus();

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get scheduler status',
      });
    }
  }

  // Analytics methods
  async getNewsletterAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.validatedParams;
      const analytics = await this.newsletterService.getNewsletterAnalytics(id);

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get newsletter analytics',
      });
    }
  }

  async getNewsletterPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { frequency, startDate, endDate } = req.query;

      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate) start = new Date(startDate as string);
      if (endDate) end = new Date(endDate as string);

      const metrics = await this.newsletterService.getNewsletterPerformanceMetrics(
        frequency as any,
        start,
        end
      );

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get performance metrics',
      });
    }
  }

  async getNewsletterEngagementTrends(req: Request, res: Response): Promise<void> {
    try {
      const { days } = req.query;
      const daysParam = days ? Number(days) : 30;

      const trends = await this.newsletterService.getNewsletterEngagementTrends(daysParam);

      res.json({
        success: true,
        data: trends,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get engagement trends',
      });
    }
  }

  async getTopPerformingNewsletters(req: Request, res: Response): Promise<void> {
    try {
      const { limit } = req.query;
      const limitParam = limit ? Number(limit) : 10;

      const newsletters = await this.newsletterService.getTopPerformingNewsletters(limitParam);

      res.json({
        success: true,
        data: newsletters,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to get top performing newsletters',
      });
    }
  }
}
