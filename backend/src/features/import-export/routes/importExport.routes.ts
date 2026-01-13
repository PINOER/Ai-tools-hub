import { Router } from 'express';
import { ImportExportController } from '../controllers/importExport.controller.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { RoleType } from '@prisma/client';
import {
  importJobRequestSchema,
  jobFiltersSchema,
  jobIdParamSchema,
  entityTypeParamSchema,
  retryJobSchema,
  cancelJobSchema,
} from '../validators/importExport.validator.ts';
import { ImportExportService } from '../services/importExport.service.ts';

const router = Router();
const importService = new ImportExportService();
const controller = new ImportExportController(importService);

// Apply auth and admin role middleware to all routes
router.use(authMiddleware);
router.use(roleMiddleware([RoleType.Admin]));

/**
 * @swagger
 * /import-export/import:
 *   post:
 *     tags: [Import/Export]
 *     summary: Start an import job
 *     description: Upload a CSV file to import data for a specific entity type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to import
 *               entityType:
 *                 type: string
 *                 enum: [Tool, Prompt, Glossary, News, Article, Learning, Category, Tag]
 *                 description: Type of entity to import
 *               options:
 *                 type: object
 *                 properties:
 *                   skipDuplicates:
 *                     type: boolean
 *                     description: Skip duplicate records instead of failing
 *                   updateExisting:
 *                     type: boolean
 *                     description: Update existing records if they exist
 *                   validateOnly:
 *                     type: boolean
 *                     description: Only validate data without importing
 *             required:
 *               - file
 *               - entityType
 *     responses:
 *       200:
 *         description: Import job started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad request - missing file or entity type
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/import',
  (req: any, res: any, next: any) => {
    // Use the global multer instance
    const upload = req.app.locals.upload;
    upload.single('file')(req, res, next);
  },
  validateRequest({ body: importJobRequestSchema }),
  controller.startImport.bind(controller)
);

/**
 * @swagger
 * /import-export/export:
 *   post:
 *     tags: [Import/Export]
 *     summary: Start an export job
 *     description: Export data for a specific entity type to CSV format
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entityType:
 *                 type: string
 *                 enum: [Tool, Prompt, Glossary, News, Article, Learning, Category, Tag]
 *                 description: Type of entity to export
 *             required:
 *               - entityType
 *     responses:
 *       200:
 *         description: Export job started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad request - missing entity type
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/export',
  validateRequest({ body: entityTypeParamSchema }),
  controller.startExport.bind(controller)
);

/**
 * @swagger
 * /import-export/jobs:
 *   get:
 *     tags: [Import/Export]
 *     summary: Get all import/export jobs
 *     description: Retrieve a list of all jobs with optional filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of jobs per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         description: Filter by job status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Pending, Processing, Completed, Failed, Cancelled]
 *       - in: query
 *         name: entityType
 *         description: Filter by entity type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Tool, Prompt, Glossary, News, Article, Learning, Category, Tag]
 *       - in: query
 *         name: jobType
 *         description: Filter by job type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Import, Export]
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ImportExportJob'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/jobs',
  validateRequest({ query: jobFiltersSchema }),
  controller.getJobs.bind(controller)
);

/**
 * @swagger
 * /import-export/jobs/{jobId}:
 *   get:
 *     tags: [Import/Export]
 *     summary: Get job status
 *     description: Retrieve the current status and details of a specific job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         description: ID of the job
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ImportExportJob'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/jobs/:jobId',
  validateRequest({ params: jobIdParamSchema }),
  controller.getJobStatus.bind(controller)
);

/**
 * @swagger
 * /import-export/jobs/{jobId}/errors:
 *   get:
 *     tags: [Import/Export]
 *     summary: Get job error logs
 *     description: Retrieve detailed error logs for a specific job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         description: ID of the job to get error logs for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job error logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/JobErrorLogs'
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/jobs/:jobId/errors',
  validateRequest({ params: jobIdParamSchema }),
  controller.getJobErrorLogs.bind(controller)
);

/**
 * @swagger
 * /import-export/jobs/{jobId}:
 *   delete:
 *     tags: [Import/Export]
 *     summary: Cancel a job
 *     description: Cancel a pending or processing job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         description: ID of the job to cancel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad request - job cannot be cancelled
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.delete(
  '/jobs/:jobId',
  validateRequest({ params: cancelJobSchema }),
  controller.cancelJob.bind(controller)
);

/**
 * @swagger
 * /import-export/jobs/{jobId}/retry:
 *   post:
 *     tags: [Import/Export]
 *     summary: Retry a failed job
 *     description: Retry a failed import or export job
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         description: ID of the failed job to retry
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job retry started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobId:
 *                       type: string
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad request - job cannot be retried
 *       404:
 *         description: Job not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/jobs/:jobId/retry',
  validateRequest({ params: retryJobSchema }),
  controller.retryJob.bind(controller)
);

/**
 * @swagger
 * /import-export/templates/{entityType}:
 *   get:
 *     tags: [Import/Export]
 *     summary: Generate CSV template
 *     description: Generate a CSV template for a specific entity type
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityType
 *         description: Type of entity for template
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Tool, Prompt, Glossary, News, Article, Learning, Category, Tag]
 *     responses:
 *       200:
 *         description: Template generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     templatePath:
 *                       type: string
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad request - invalid entity type
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/templates/:entityType',
  validateRequest({ params: entityTypeParamSchema }),
  controller.generateTemplate.bind(controller)
);

/**
 * @swagger
 * /import-export/last-job/{entityType}:
 *   get:
 *     tags: [Import/Export]
 *     summary: Get last job for specific entity type
 *     description: Retrieve the most recent import/export job for a specific entity type with job details and exported file link
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityType
 *         description: Type of entity to get last job for
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Tool, Prompt, Glossary, News, Article, Learning, Category, Tag]
 *     responses:
 *       200:
 *         description: Last job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       $ref: '#/components/schemas/ImportExportJob'
 *                     downloadUrl:
 *                       type: string
 *                       description: Download URL for exported file (if job is completed and file exists)
 *       400:
 *         description: Bad request - invalid entity type
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: No job found for the specified entity type
 */
router.get(
  '/last-job/:entityType',
  validateRequest({ params: entityTypeParamSchema }),
  controller.getLastJobByEntityType.bind(controller)
);

/**
 * @swagger
 * /import-export/queue/status:
 *   get:
 *     tags: [Import/Export]
 *     summary: Get job queue status
 *     description: Get current status of import/export job queues
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Queue status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     import:
 *                       type: object
 *                       properties:
 *                         waiting:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *                     export:
 *                       type: object
 *                       properties:
 *                         waiting:
 *                           type: integer
 *                         active:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         failed:
 *                           type: integer
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/queue/status', controller.getQueueStatus.bind(controller));

export default router;
