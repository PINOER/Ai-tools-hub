import { EntityType, ImportExportStatus, JobType } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ImportJobRequest,
  ImportResult,
  ExportResult,
} from '../validators/importExport.validator.ts';
import { JobQueueService } from './jobQueue.service.ts';
import { WorkerThreadService } from './workerThread.service.ts';
import { AwsService } from '../../aws/services/aws.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { prisma } from '@config/index.ts';
import logger from '../../../utils/logger.ts';
import { ProcessorFactory } from './processors/processorFactory.ts';
import { pusherService } from 'services/pusher.service.ts';

export class ImportExportService {
  private jobQueue: JobQueueService;
  private workerThreadService: WorkerThreadService;
  private awsService: AwsService;
  private activityService: ActivityService;

  constructor() {
    this.jobQueue = new JobQueueService(prisma);
    this.workerThreadService = new WorkerThreadService();
    this.awsService = new AwsService();
    this.activityService = new ActivityService();

    this.jobQueue.setProcessors(
      async (jobId: string, entityType: EntityType, filePath: string, options: any) => {
        return this.processImportJobWithWorker(jobId, entityType, filePath, options);
      },
      async (jobId: string, entityType: EntityType) => {
        return this.processExportJobWithWorker(jobId, entityType);
      }
    );

    this.jobQueue.startProcessing();
  }

  /**
   * Start an import job
   */
  async startImportJob(request: ImportJobRequest, adminId: number): Promise<ImportResult> {
    logger.info(`Import job started: ${request.entityType} by admin ${adminId}`);

    const jobId = uuidv4();
    const filePath = request.file.path;

    await prisma.importExportJob.create({
      data: {
        id: jobId,
        entityType: request.entityType,
        jobType: 'Import' as JobType,
        fileName: request.file.originalname,
        filePath,
        status: 'Pending' as ImportExportStatus,
        adminId,
        metadata: request.options,
      },
    });

    // Add job to queue for background processing
    await this.jobQueue.addImportJob(jobId, request.entityType, filePath, request.options, adminId);
    logger.info(`Job ${jobId} added to queue successfully`);

    // Log activity
    await this.activityService.logActivity({
      title: 'Import Started',
      description: `Import job started: ${request.entityType}`,
      icon: '📊',
      user_id: adminId,
      entity_type: 'import',
      entity_name: `${request.entityType} Import`,
      metadata: { jobId, fileName: request.file.originalname },
    });

    return {
      success: true,
      totalRows: 0,
      processedRows: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
      jobId,
    };
  }

  /**
   * Start an export job
   */
  async startExportJob(entityType: EntityType, adminId: number): Promise<ExportResult> {
    try {
      // Check if a recent export file already exists (less than 1 day old)
      const recentFileCheck = await this.awsService.checkRecentExportFile(entityType);

      if (recentFileCheck.exists && recentFileCheck.isRecent && recentFileCheck.url) {
        logger.info(
          `Recent export file found for ${entityType} (${recentFileCheck.ageInHours} hours old), returning existing file`
        );

        // Create a job record for the existing file
        const jobId = uuidv4();
        const fileName =
          recentFileCheck.key?.split('/').pop() ||
          `${entityType.toLowerCase()}_export_${Date.now()}.csv`;

        await prisma.importExportJob.create({
          data: {
            id: jobId,
            entityType: entityType,
            jobType: JobType.Export,
            fileName,
            filePath: recentFileCheck.key || '',
            status: ImportExportStatus.Completed,
            adminId,
            metadata: {
              s3Url: recentFileCheck.url,
              reusedFile: true,
              fileAge: recentFileCheck.ageInHours,
            },
            completedAt: new Date(),
          },
        });

        return {
          success: true,
          filePath: recentFileCheck.url,
          totalRecords: 0,
          jobId,
        };
      }

      // No recent file found, proceed with new export
      const jobId = uuidv4();
      const fileName = `${entityType.toLowerCase()}_export_${Date.now()}.csv`;
      const s3Key = `exports/${entityType.toLowerCase()}/${fileName}`;

      // Create job record
      await prisma.importExportJob.create({
        data: {
          id: jobId,
          entityType: entityType,
          jobType: JobType.Export,
          fileName,
          filePath: s3Key,
          status: ImportExportStatus.Processing,
          adminId,
        },
      });

      // Add job to queue for background processing
      await this.jobQueue.addExportJob(jobId, entityType, adminId);

      // Log activity
      await this.activityService.logActivity({
        title: 'Export Started',
        description: `Export job started: ${entityType}`,
        icon: '📊',
        user_id: adminId,
        entity_type: 'export',
        entity_name: `${entityType} Export`,
        metadata: { jobId, fileName },
      });

      return {
        success: true,
        filePath: s3Key,
        totalRecords: 0,
        jobId,
      };
    } catch (error) {
      logger.error(`Failed to start export job for ${entityType}:`, error);
      throw error;
    }
  }

  /**
   * Process import job directly (without worker thread to avoid TypeScript issues)
   * Since Bull queue already provides background processing, worker threads are not necessary
   */
  private async processImportJobWithWorker(
    jobId: string,
    entityType: EntityType,
    filePath: string,
    options: any
  ): Promise<void> {
    logger.info(`Processing import job ${jobId} for ${entityType}`);

    try {
      await this.updateJobStatus(jobId, 'Processing' as ImportExportStatus);

      // Process directly instead of using worker thread to avoid TypeScript loading issues
      const result = await this.processImportDirectly(jobId, entityType, filePath, options);

      // Determine final status based on errors
      const hasErrors = result.errors && result.errors.length > 0;
      const finalStatus = hasErrors ? 'Failed' : 'Completed';

      logger.info(
        `Import job ${jobId} completed. Status: ${finalStatus}, Errors: ${result.errorCount}, Success: ${result.successCount}`
      );

      if (hasErrors) {
        logger.info(`Storing ${result.errors.length} error logs for job ${jobId}:`, result.errors);
      }

      // Update job with final results including error logs
      await prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          totalRows: result.totalRows,
          processedRows: result.processedRows,
          successCount: result.successCount,
          errorCount: result.errorCount,
          errorLogs: hasErrors ? JSON.stringify(result.errors) : null,
          completedAt: new Date(),
          status: finalStatus,
        },
      });

      // Update job status to final status
      await this.updateJobStatus(jobId, finalStatus as ImportExportStatus);

      // Log activity for import completion
      const job = await prisma.importExportJob.findUnique({
        where: { id: jobId },
        select: { adminId: true },
      });

      await this.activityService.logActivity({
        title: 'Import Completed',
        description: `Import job completed: ${entityType}`,
        icon: '✅',
        user_id: job?.adminId || 1, // Default to admin user if not specified
        entity_type: 'import',
        entity_name: `${entityType} Import`,
        metadata: {
          jobId,
          status: finalStatus,
          successCount: result.successCount,
          errorCount: result.errorCount,
        },
      });
      await pusherService.triggerBulkUploadSuccess(
        job?.adminId || 1,
        `Import job ${jobId} completed successfully with ${result.successCount} records. Errors: ${result.errorCount}`
      );
    } catch (error) {
      await this.updateJobStatus(jobId, 'Failed' as ImportExportStatus);

      // Store error logs
      await prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          errorLogs: JSON.stringify([(error as Error).message]),
        },
      });

      throw error;
    }
  }

  /**
   * Wrapper method to call WorkerThreadService for export jobs
   */
  private async processExportJobWithWorker(jobId: string, entityType: EntityType): Promise<void> {
    try {
      await this.updateJobStatus(jobId, 'Processing' as ImportExportStatus);

      const result = await this.workerThreadService.processExportInWorker(jobId, entityType);

      if (result.success) {
        // Update job with export results including S3 URL
        await prisma.importExportJob.update({
          where: { id: jobId },
          data: {
            filePath: result.filePath, // This will be the S3 key
            totalRows: result.totalRecords,
            processedRows: result.totalRecords,
            successCount: result.totalRecords,
            errorCount: 0,
            completedAt: new Date(),
            status: 'Completed' as ImportExportStatus,
            metadata: {
              s3Url: result.s3Url,
            },
          },
        });

        await this.updateJobStatus(jobId, 'Completed' as ImportExportStatus);
        logger.info(
          `Export job ${jobId} completed successfully with ${result.totalRecords} records. S3 URL: ${result.s3Url}`
        );

        // Log activity for export completion
        const job = await prisma.importExportJob.findUnique({
          where: { id: jobId },
          select: { adminId: true },
        });

        await this.activityService.logActivity({
          title: 'Export Completed',
          description: `Export job completed: ${entityType}`,
          icon: '✅',
          user_id: job?.adminId || 1, // Default to admin user if not specified
          entity_type: 'export',
          entity_name: `${entityType} Export`,
          metadata: {
            jobId,
            totalRecords: result.totalRecords,
            s3Url: result.s3Url,
          },
        });
      } else {
        // Handle failed export with error details
        const errorMessage = result.error || 'Export failed with unknown error';
        logger.error(`Export job ${jobId} failed: ${errorMessage}`);

        await prisma.importExportJob.update({
          where: { id: jobId },
          data: {
            status: 'Failed' as ImportExportStatus,
            completedAt: new Date(),
            errorLogs: JSON.stringify([errorMessage]),
            errorCount: 1,
            totalRows: 0,
            processedRows: 0,
            successCount: 0,
          },
        });

        await this.updateJobStatus(jobId, 'Failed' as ImportExportStatus);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Export job ${jobId} processing failed:`, error);

      // Update job status to failed with detailed error
      await prisma.importExportJob.update({
        where: { id: jobId },
        data: {
          status: 'Failed' as ImportExportStatus,
          completedAt: new Date(),
          errorLogs: JSON.stringify([errorMessage]),
          errorCount: 1,
          totalRows: 0,
          processedRows: 0,
          successCount: 0,
        },
      });

      await this.updateJobStatus(jobId, 'Failed' as ImportExportStatus);
      throw error;
    }
  }

  /**
   * Parse CSV row properly handling quoted fields
   */
  private parseCSVRow(row: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add the last value
    values.push(current.trim());

    // Remove quotes from values
    return values.map((value) => value.replace(/^"|"$/g, ''));
  }

  private async parseJsonFile(filePath: string): Promise<any[]> {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Ensure the JSON is an array of objects (just like CSV rows)
    if (!Array.isArray(data)) {
      throw new Error('JSON file must contain an array of objects');
    }
    return data;
  }

  /**
   * Process import directly without worker thread
   * @param options - Import options (skipDuplicates, updateExisting, etc.) - reserved for future use
   */
  /**
   * Process import directly without worker thread
   * Supports CSV and JSON files
   */
  private async processImportDirectly(
    jobId: string,
    entityType: EntityType,
    filePath: string,
    _options: any // eslint-disable-line @typescript-eslint/no-unused-vars
  ): Promise<{
    success: boolean;
    totalRows: number;
    processedRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  }> {
    try {
      await fs.access(filePath);

      const extension = path.extname(filePath).toLowerCase();
      let dataRows: any[] = [];

      // 🔍 Detect file type
      if (extension === '.json') {
        logger.info(`Detected JSON file: ${filePath}`);
        dataRows = await this.parseJsonFile(filePath);
      } else if (extension === '.csv') {
        logger.info(`Detected CSV file: ${filePath}`);
        const csvContent = await fs.readFile(filePath, 'utf-8');
        const lines = csvContent.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',').map((h) => h.trim());

        if (!headers.length) {
          throw new Error('No headers found in CSV');
        }

        dataRows = lines.slice(1).map((line) => {
          const values = this.parseCSVRow(line);
          const rowData: Record<string, string> = {};
          headers.forEach((header, i) => (rowData[header] = values[i] || ''));
          return rowData;
        });
      } else {
        throw new Error(`Unsupported file format: ${extension}`);
      }

      const totalRows = dataRows.length;
      if (totalRows === 0) throw new Error('No data rows found');

      let processedRows = 0;
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < totalRows; i++) {
        const rowData = dataRows[i];
        try {
          const processor = ProcessorFactory.createProcessor(entityType, prisma);
          const processedData = await processor.processData(rowData);

          logger.info(`${entityType} created successfully with ID: ${processedData.id}`);
          successCount++;
        } catch (error) {
          const errorMsg = `Row ${i + 1}: ${(error as Error).message}`;
          logger.error(errorMsg);
          errors.push(errorMsg);
          errorCount++;
        } finally {
          processedRows++;
        }
      }

      const success = errors.length === 0;
      if (success) {
        try {
          await fs.unlink(filePath);
          logger.info(`File deleted successfully: ${filePath}`);
        } catch (unlinkError) {
          logger.warn(`Failed to delete file: ${filePath}`, unlinkError);
        }
      }

      return {
        success,
        totalRows,
        processedRows,
        successCount,
        errorCount,
        errors,
      };
    } catch (error) {
      logger.error(`Import processing failed for job ${jobId}:`, error);
      throw error;
    }
  }

  /**
   * Update job status
   */
  private async updateJobStatus(jobId: string, status: ImportExportStatus): Promise<void> {
    await prisma.importExportJob.update({
      where: { id: jobId },
      data: {
        status,
        completedAt: status === 'Completed' || status === 'Failed' ? new Date() : null,
      },
    });
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<any> {
    const job = await prisma.importExportJob.findUnique({
      where: { id: jobId },
      include: {
        admin: { select: { username: true, first_name: true, last_name: true } },
      },
    });

    return job;
  }

  /**
   * Get job error logs
   */
  async getJobErrorLogs(jobId: string): Promise<any> {
    const job = await prisma.importExportJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        adminId: true,
        errorLogs: true,
        status: true,
        errorCount: true,
        processedRows: true,
        totalRows: true,
      },
    });

    if (!job) {
      throw new Error('Job not found');
    }

    return {
      ...job,
      errorLogs: job.errorLogs ? JSON.parse(job.errorLogs) : null,
    };
  }

  /**
   * Get all jobs with filters
   */
  async getJobs(filters: any): Promise<{ jobs: any[]; total: number }> {
    const where: any = {};

    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.jobType) where.jobType = filters.jobType;
    if (filters.status) where.status = filters.status;
    if (filters.adminId) where.adminId = filters.adminId;

    if (filters.startDate || filters.endDate) {
      where.startedAt = {};
      if (filters.startDate) where.startedAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.startedAt.lte = new Date(filters.endDate);
    }

    const [jobs, total] = await Promise.all([
      prisma.importExportJob.findMany({
        where,
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        orderBy: { startedAt: 'desc' },
        include: { admin: { select: { username: true, first_name: true, last_name: true } } },
      }),
      prisma.importExportJob.count({ where }),
    ]);

    return { jobs, total };
  }

  /**
   * Cancel a job
   */
  async cancelJob(jobId: string): Promise<void> {
    await this.updateJobStatus(jobId, 'Cancelled' as ImportExportStatus);
  }

  /**
   * Generate CSV template for a specific entity type
   */
  async generateTemplate(entityType: EntityType): Promise<string> {
    const templateDir = path.join(process.cwd(), 'downloads', 'templates');
    const fileName = `${entityType.toLowerCase()}_template.csv`;
    const filePath = path.join(templateDir, fileName);

    // Ensure template directory exists
    await fs.mkdir(templateDir, { recursive: true });

    // Generate template content based on entity type
    let templateContent = '';

    switch (entityType) {
      case 'Tool':
        templateContent =
          'name,short_description,website_url,avatar,full_description,category_name,secondary_category_names,seo_meta_title,seo_meta_description,pricing_model,status,is_featured,free_plan_available,free_plan_details,paid_plan_details,is_unique,url_slug,tool_tags,use_cases,features,screenshots,platform_availability,social_links,tool_role_names,tool_industry_names\n';
        break;
      case 'Article':
        templateContent =
          'title,content,excerpt,featured_image,author_name,status,tags,categories\n';
        break;
      case 'News':
        templateContent =
          'title,content,excerpt,featured_image,source_url,published_date,status,tags,categories\n';
        break;
      case 'Glossary':
        templateContent = 'term,definition,examples,related_terms,categories\n';
        break;
      default:
        templateContent = 'id,name,description,status\n';
    }

    // Write template file
    await fs.writeFile(filePath, templateContent, 'utf-8');

    return filePath;
  }

  /**
   * Get queue status
   */
  async getQueueStatus() {
    return this.jobQueue.getQueueStatus();
  }

  /**
   * Get last job for specific entity type
   */
  async getLastJobByEntityType(entityType: EntityType) {
    try {
      const lastJob = await prisma.importExportJob.findFirst({
        where: {
          entityType,
        },
        orderBy: {
          startedAt: 'desc',
        },
      });

      if (!lastJob) {
        return null;
      }

      let downloadUrl = '';
      if (lastJob.metadata && typeof lastJob.metadata === 'object' && 's3Url' in lastJob.metadata) {
        downloadUrl = lastJob.metadata.s3Url as string;
      }

      return {
        data: {
          ...lastJob,
          downloadUrl,
        },
      };
    } catch (error) {
      logger.error(`Error getting last job for entity type ${entityType}:`, error);
      throw error;
    }
  }
}
