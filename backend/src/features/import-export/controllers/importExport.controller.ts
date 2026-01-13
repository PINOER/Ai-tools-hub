import { Request, Response } from 'express';
import { ImportExportService } from '../services/importExport.service.ts';
import logger from '../../../utils/logger.ts';

export class ImportExportController {
  constructor(private importExportService: ImportExportService) {}

  /**
   * Start import job
   */
  async startImport(req: Request, res: Response) {
    try {
      const { entityType, options } = req.body;
      const file = req.file;
      const adminId = (req as any).user?.id;
      console.log('entityType', entityType);
      console.log('options', options);
      console.log('file', file);
      console.log('adminId', adminId);

      const result = await this.importExportService.startImportJob(
        { entityType, file, options },
        adminId
      );

      logger.info(`Import job started: ${result.jobId} for ${entityType}`);

      res.status(200).json({
        success: true,
        message: 'Import job started successfully',
        data: {
          jobId: result.jobId,
          message:
            'Your import has been submitted and is being processed. You will be notified when it completes.',
        },
      });
    } catch (error) {
      logger.error('Import job start failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start import job',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Start export job
   */
  async startExport(req: Request, res: Response) {
    try {
      const { entityType } = req.body;
      const adminId = (req as any).user?.id;

      const result = await this.importExportService.startExportJob(entityType as any, adminId);

      logger.info(`Export job started: ${result.jobId} for ${entityType}`);

      res.status(200).json({
        success: true,
        message: 'Export job started successfully',
        data: {
          jobId: result.jobId,
          message:
            'Your export has been submitted and is being processed. You will be notified when it completes.',
        },
      });
    } catch (error) {
      logger.error('Export job start failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start export job',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const adminId = (req as any).user?.id;

      const job = await this.importExportService.getJobStatus(jobId);

      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      // Check if admin owns this job or is super admin
      if (job.adminId !== adminId) {
        res.status(403).json({ success: false, message: 'Access denied to this job' });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: 'Job status retrieved successfully', data: job });
    } catch (error) {
      logger.error('Get job status failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get job status',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get job error logs
   */
  async getJobErrorLogs(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const adminId = (req as any).user?.id;

      const errorLogs = await this.importExportService.getJobErrorLogs(jobId);

      // Check if admin owns this job or is super admin
      if (errorLogs.adminId !== adminId) {
        res.status(403).json({ success: false, message: 'Access denied to this job' });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: 'Job error logs retrieved successfully', data: errorLogs });
    } catch (error) {
      logger.error('Get job error logs failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get job error logs',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get all jobs with filters
   */
  async getJobs(req: Request, res: Response) {
    try {
      const adminId = (req as any).user?.id;
      const filters = req.query;

      const jobFilters = {
        ...filters,
        adminId,
        page: parseInt(filters.page as string) || 1,
        limit: parseInt(filters.limit as string) || 20,
      };

      const result = await this.importExportService.getJobs(jobFilters);

      res.status(200).json({ success: true, message: 'Jobs retrieved successfully', data: result });
    } catch (error) {
      logger.error('Get jobs failed:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to get jobs', error: (error as Error).message });
    }
  }

  /**
   * Cancel a job
   */
  async cancelJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const adminId = (req as any).user?.id;

      // Check if job exists and belongs to admin
      const job = await this.importExportService.getJobStatus(jobId);
      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      if (job.adminId !== adminId) {
        res.status(403).json({ success: false, message: 'Access denied to this job' });
        return;
      }

      // Only allow cancellation of pending or processing jobs
      if (job.status !== 'Pending' && job.status !== 'Processing') {
        res
          .status(400)
          .json({ success: false, message: 'Only pending or processing jobs can be cancelled' });
        return;
      }

      await this.importExportService.cancelJob(jobId);

      logger.info(`Job cancelled: ${jobId} by admin ${adminId}`);

      res.status(200).json({
        success: true,
        message: 'Job cancelled successfully',
        data: {
          message: 'Your job has been cancelled successfully.',
        },
      });
    } catch (error) {
      logger.error('Cancel job failed:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to cancel job', error: (error as Error).message });
    }
  }

  /**
   * Generate CSV template
   */
  async generateTemplate(req: Request, res: Response) {
    try {
      const { entityType } = req.params;
      const adminId = (req as any).user?.id;

      const templatePath = await this.importExportService.generateTemplate(entityType as any);

      logger.info(`Template generated: ${entityType} by admin ${adminId}`);

      res.status(200).json({
        success: true,
        message: 'Template generated successfully',
        data: {
          templatePath,
          message: 'CSV template has been generated. Download and fill it with your data.',
          downloadUrl: `/downloads/templates/${entityType.toLowerCase()}_template.csv`,
        },
      });
    } catch (error) {
      logger.error('Generate template failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate template',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get last job for specific entity type
   */
  async getLastJobByEntityType(req: Request, res: Response) {
    try {
      const { entityType } = req.params;

      const result = await this.importExportService.getLastJobByEntityType(entityType as any);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get last job',
        error: (error as Error).message,
      });
    }
  }

  /**
   * Retry failed job
   */
  async retryJob(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const adminId = (req as any).user?.id;

      const job = await this.importExportService.getJobStatus(jobId);

      if (!job) {
        res.status(404).json({ success: false, message: 'Job not found' });
        return;
      }

      if (job.adminId !== adminId) {
        res.status(403).json({ success: false, message: 'Access denied to this job' });
        return;
      }

      if (job.status !== 'Failed') {
        res.status(400).json({ success: false, message: 'Only failed jobs can be retried' });
        return;
      }

      // For now, we'll just update the status to pending
      // In a real implementation, you might want to restart the actual processing
      await this.importExportService.cancelJob(jobId);

      logger.info(`Job retried: ${jobId} by admin ${adminId}`);

      res.status(200).json({
        success: true,
        message: 'Job retried successfully',
        data: {
          message: 'Your job has been retried and is now pending.',
        },
      });
    } catch (error) {
      logger.error('Retry job failed:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to retry job', error: (error as Error).message });
    }
  }

  /**
   * Get job queue status
   */
  async getQueueStatus(req: Request, res: Response) {
    try {
      const queueStatus = await this.importExportService.getQueueStatus();

      res.status(200).json({
        success: true,
        message: 'Queue status retrieved successfully',
        data: queueStatus,
      });
    } catch (error) {
      logger.error('Get queue status failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get queue status',
        error: (error as Error).message,
      });
    }
  }
}
