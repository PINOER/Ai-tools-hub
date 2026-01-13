import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller.js';
import { NewsletterService } from '../services/newsletter.service.js';
import { validateRequest } from '@middleware/validation.middleware.js';
import {
  createNewsletterSchema,
  updateNewsletterSchema,
  scheduleNewsletterSchema,
  cancelNewsletterSchema,
  getNewsletterSchema,
  getNewslettersSchema,
  deleteNewsletterSchema,
} from '../validators/newsletter.validator.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Newsletter:
 *       type: object
 *       required:
 *         - subject
 *         - template
 *       properties:
 *         id:
 *           type: integer
 *           description: Newsletter ID
 *         subject:
 *           type: string
 *           maxLength: 200
 *           description: Newsletter subject
 *         template:
 *           type: string
 *           description: Newsletter template content
 *         frequency:
 *           $ref: '#/components/schemas/NewsletterFrequencyEnum'
 *         send_day:
 *           $ref: '#/components/schemas/WeekDayEnum'
 *         send_time:
 *           type: string
 *           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *           description: Send time in HH:MM format
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Campaign start date
 *         status:
 *           $ref: '#/components/schemas/NewsletterStatusEnum'
 *         is_enabled:
 *           type: boolean
 *           description: Whether the newsletter is enabled
 *         send_mode:
 *           $ref: '#/components/schemas/SendModeEnum'
 *         template_type:
 *           $ref: '#/components/schemas/NewsletterTemplateContentEnum'
 *         fallback_type:
 *           $ref: '#/components/schemas/FallbackContentEnum'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     NewsletterFrequencyEnum:
 *       type: string
 *       enum: [Daily, Weekly, Monthly, Custom]
 *       description: Newsletter frequency options
 *
 *     WeekDayEnum:
 *       type: string
 *       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *       description: Days of the week
 *
 *     SendModeEnum:
 *       type: string
 *       enum: [Automatic, Approval]
 *       description: Newsletter send mode
 *
 *     NewsletterTemplateContentEnum:
 *       type: string
 *       enum: [AI_NEWSLETTER_OVERVIEW, TOP_TOOLS_WEEK, TOP_ARTICLES_WEEK, FEATURED_LEARNING_CONTENT, AI_NEWS]
 *       description: Newsletter template content types
 *
 *     FallbackContentEnum:
 *       type: string
 *       enum: [SHOW_POPULAR_TOOLS, INCLUDE_TRENDING_CONTENT]
 *       description: Fallback content options
 *
 *     NewsletterStatusEnum:
 *       type: string
 *       enum: [Draft, Scheduled, Sent, Failed, Cancelled]
 *       description: Newsletter status options
 *
 *     NewsletterEngagement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         newsletter_id:
 *           type: integer
 *         opened:
 *           type: boolean
 *         clicked:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     NewsletterAnalytics:
 *       type: object
 *       properties:
 *         newsletter:
 *           $ref: '#/components/schemas/Newsletter'
 *         totalEngagements:
 *           type: integer
 *         openedCount:
 *           type: integer
 *         clickedCount:
 *           type: integer
 *         openRate:
 *           type: number
 *         clickRate:
 *           type: number
 *         clickToOpenRate:
 *           type: number
 *
 *     NewsletterPerformanceMetrics:
 *       type: object
 *       properties:
 *         totalNewsletters:
 *           type: integer
 *         totalEngagements:
 *           type: integer
 *         totalOpened:
 *           type: integer
 *         totalClicked:
 *           type: integer
 *         averageOpenRate:
 *           type: number
 *         averageClickRate:
 *           type: number
 *         averageClickToOpenRate:
 *           type: number
 *
 *     NewsletterTrendData:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *         newslettersSent:
 *           type: integer
 *         totalEngagements:
 *           type: integer
 *         openedCount:
 *           type: integer
 *         clickedCount:
 *           type: integer
 *         openRate:
 *           type: number
 *         clickRate:
 *           type: number
 *
 *     TopPerformingNewsletter:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         subject:
 *           type: string
 *         sentAt:
 *           type: string
 *           format: date-time
 *         totalEngagements:
 *           type: integer
 *         openedCount:
 *           type: integer
 *         clickedCount:
 *           type: integer
 *         openRate:
 *           type: number
 *         clickRate:
 *           type: number
 *
 *     SchedulerStatus:
 *       type: object
 *       properties:
 *         isRunning:
 *           type: boolean
 *         intervalMinutes:
 *           type: integer
 *
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         pages:
 *           type: integer
 *
 *     FilterInfo:
 *       type: object
 *       properties:
 *         applied:
 *           type: object
 *           description: Currently applied filters
 *         sortBy:
 *           type: object
 *           properties:
 *             field:
 *               type: string
 *             order:
 *               type: string
 */

const router = Router();
const newsletterService = new NewsletterService();
const newsletterController = new NewsletterController(newsletterService);

/**
 * @swagger
 * /newsletters:
 *   post:
 *     tags: [Newsletters]
 *     summary: Create a new newsletter
 *     description: Create a new newsletter with the specified configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Newsletter'
 *     responses:
 *       201:
 *         description: Newsletter created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Newsletter'
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 */
router.post(
  '/',
  validateRequest(createNewsletterSchema),
  newsletterController.createNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/{id}:
 *   put:
 *     tags: [Newsletters]
 *     summary: Update a newsletter
 *     description: Update an existing newsletter by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Newsletter'
 *     responses:
 *       200:
 *         description: Newsletter updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Newsletter not found
 */
router.put(
  '/:id',
  validateRequest(updateNewsletterSchema),
  newsletterController.updateNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/{id}:
 *   delete:
 *     tags: [Newsletters]
 *     summary: Delete a newsletter
 *     description: Delete a newsletter by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     responses:
 *       200:
 *         description: Newsletter deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Newsletter not found
 */
router.delete(
  '/:id',
  validateRequest(deleteNewsletterSchema),
  newsletterController.deleteNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/{id}:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get a newsletter by ID
 *     description: Retrieve a specific newsletter by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     responses:
 *       200:
 *         description: Newsletter retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Newsletter'
 *       404:
 *         description: Newsletter not found
 */
router.get(
  '/:id',
  validateRequest(getNewsletterSchema),
  newsletterController.getNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get all newsletters
 *     description: Retrieve a paginated list of newsletters with comprehensive filtering and sorting options
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/NewsletterStatusEnum'
 *         description: Filter by newsletter status
 *       - in: query
 *         name: frequency
 *         schema:
 *           $ref: '#/components/schemas/NewsletterFrequencyEnum'
 *         description: Filter by newsletter frequency
 *       - in: query
 *         name: send_day
 *         schema:
 *           $ref: '#/components/schemas/WeekDayEnum'
 *         description: Filter by send day of the week
 *       - in: query
 *         name: send_mode
 *         schema:
 *           $ref: '#/components/schemas/SendModeEnum'
 *         description: Filter by send mode
 *       - in: query
 *         name: template_type
 *         schema:
 *           $ref: '#/components/schemas/NewsletterTemplateContentEnum'
 *         description: Filter by template type
 *       - in: query
 *         name: fallback_type
 *         schema:
 *           $ref: '#/components/schemas/FallbackContentEnum'
 *         description: Filter by fallback content type
 *       - in: query
 *         name: is_enabled
 *         schema:
 *           type: boolean
 *         description: Filter by enabled status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in subject and template content
 *       - in: query
 *         name: start_date_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date from (ISO date string)
 *       - in: query
 *         name: start_date_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date to (ISO date string)
 *       - in: query
 *         name: created_date_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date from (ISO date string)
 *       - in: query
 *         name: created_date_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date to (ISO date string)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [subject, status, frequency, start_date, created_at, updated_at]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Newsletters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Newsletter'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *                 filters:
 *                   $ref: '#/components/schemas/FilterInfo'
 *       400:
 *         description: Bad request
 */
router.get(
  '/',
  validateRequest(getNewslettersSchema),
  newsletterController.getNewsletters.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/{id}/schedule:
 *   post:
 *     tags: [Newsletters]
 *     summary: Schedule a newsletter
 *     description: Schedule a draft newsletter for sending
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     responses:
 *       200:
 *         description: Newsletter scheduled successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Newsletter not found
 */
router.post(
  '/:id/schedule',
  validateRequest(scheduleNewsletterSchema),
  newsletterController.scheduleNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/{id}/cancel:
 *   post:
 *     tags: [Newsletters]
 *     summary: Cancel a newsletter
 *     description: Cancel a scheduled newsletter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     responses:
 *       200:
 *         description: Newsletter cancelled successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Newsletter not found
 */
router.post(
  '/:id/cancel',
  validateRequest(cancelNewsletterSchema),
  newsletterController.cancelNewsletter.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/process-scheduled:
 *   post:
 *     tags: [Newsletters]
 *     summary: Process scheduled newsletters
 *     description: Manually trigger processing of scheduled newsletters
 *     responses:
 *       200:
 *         description: Scheduled newsletters processed successfully
 *       400:
 *         description: Bad request
 */
router.post(
  '/process-scheduled',
  newsletterController.processScheduledNewsletters.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/ready-to-send:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get newsletters ready to send
 *     description: Retrieve newsletters that are ready to be sent
 *     responses:
 *       200:
 *         description: Newsletters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Newsletter'
 *                 count:
 *                   type: integer
 */
router.get(
  '/ready-to-send',
  newsletterController.getReadyToSendNewsletters.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/scheduler/start:
 *   post:
 *     tags: [Newsletters]
 *     summary: Start newsletter scheduler
 *     description: Start the automated newsletter scheduler with BullMQ queue system
 *     responses:
 *       200:
 *         description: Scheduler started successfully
 *       400:
 *         description: Bad request
 */
router.post('/scheduler/start', newsletterController.startScheduler.bind(newsletterController));

/**
 * @swagger
 * /newsletters/scheduler/stop:
 *   post:
 *     tags: [Newsletters]
 *     summary: Stop newsletter scheduler
 *     description: Stop the automated newsletter scheduler
 *     responses:
 *       200:
 *         description: Scheduler stopped successfully
 *       400:
 *         description: Bad request
 */
router.post('/scheduler/stop', newsletterController.stopScheduler.bind(newsletterController));

/**
 * @swagger
 * /newsletters/scheduler/status:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get scheduler status
 *     description: Get the current status of the newsletter scheduler
 *     responses:
 *       200:
 *         description: Scheduler status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/SchedulerStatus'
 */
router.get('/scheduler/status', newsletterController.getSchedulerStatus.bind(newsletterController));

// Analytics routes
/**
 * @swagger
 * /newsletters/{id}/analytics:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get newsletter analytics
 *     description: Retrieve analytics data for a specific newsletter
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Newsletter ID
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NewsletterAnalytics'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Newsletter not found
 */
router.get(
  '/:id/analytics',
  validateRequest(getNewsletterSchema),
  newsletterController.getNewsletterAnalytics.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/analytics/performance:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get newsletter performance metrics
 *     description: Retrieve overall performance metrics for newsletters
 *     parameters:
 *       - in: query
 *         name: frequency
 *         schema:
 *           $ref: '#/components/schemas/NewsletterFrequencyEnum'
 *         description: Filter by newsletter frequency
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NewsletterPerformanceMetrics'
 */
router.get(
  '/analytics/performance',
  newsletterController.getNewsletterPerformanceMetrics.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/analytics/trends:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get newsletter engagement trends
 *     description: Retrieve engagement trends over time
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Engagement trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NewsletterTrendData'
 */
router.get(
  '/analytics/trends',
  newsletterController.getNewsletterEngagementTrends.bind(newsletterController)
);

/**
 * @swagger
 * /newsletters/analytics/top-performing:
 *   get:
 *     tags: [Newsletters]
 *     summary: Get top performing newsletters
 *     description: Retrieve the best performing newsletters by engagement metrics
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of newsletters to return
 *     responses:
 *       200:
 *         description: Top performing newsletters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopPerformingNewsletter'
 */
router.get(
  '/analytics/top-performing',
  newsletterController.getTopPerformingNewsletters.bind(newsletterController)
);

export default router;
