import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.ts';
import {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
} from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { ReviewService } from '../services/review.service.ts';
import {
  createReviewSchema,
  markHelpfulSchema,
  reportReviewSchema,
  reviewQuerySchema,
  toolIdParams,
  updateReviewSchema,
  bulkReviewStatusUpdateSchema,
  bulkReviewDeleteSchema,
} from '../validators/review.validator.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { z } from 'zod';
import { existsMiddleware } from '../../../middleware/existence.middleware.ts';
import { RoleType } from '@prisma/client';

const router = Router();
const reviewService = new ReviewService();
const reviewController = new ReviewController(reviewService);
/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews with pagination and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of reviews per page
 *       - in: query
 *         name: tool_id
 *         schema:
 *           type: integer
 *         description: ID of the tool to filter reviews
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: ID of the user to filter reviews
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PendingReport, Approved, Reported, Flagged]
 *         description: Filter reviews by moderation status
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [recent, rating, helpful]
 *         description: Sort reviews by recent, rating, or helpful count
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search reviews by tool name or user name (first name, last name, username)
 *         example: "ChatGPT"
 *     responses:
 *       200:
 *         description: List of reviews with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       overall_rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                       tool:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                       criteria:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                             rating:
 *                               type: number
 *                             comment:
 *                               type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */

router.get(
  '/',
  optionalAuthMiddleware,
  validateRequest({ query: reviewQuerySchema }),
  reviewController.getAllReviews.bind(reviewController)
);

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Submit a new review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tool_id
 *               - overall_rating
 *               - comment
 *               - criteria
 *             properties:
 *               tool_id:
 *                 type: integer
 *               overall_rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               criteria:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [name, rating, comment]
 *                   properties:
 *                     name:
 *                       type: string
 *                     rating:
 *                       type: number
 *                       minimum: 1
 *                       maximum: 5
 *                     comment:
 *                       type: string
 *     responses:
 *       201:
 *         description: Review submitted
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createReviewSchema }),
  existsMiddleware.toolExists,
  reviewController.createReview.bind(reviewController)
);

/**
 * @swagger
 * /reviews/mark-helpful:
 *   post:
 *     tags: [Reviews]
 *     summary: Mark a review as helpful
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [review_id]
 *             properties:
 *               review_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Marked as helpful
 */
router.post(
  '/mark-helpful',
  authMiddleware,
  validateRequest({ body: markHelpfulSchema }),
  reviewController.markHelpful.bind(reviewController)
);

/**
 * @swagger
 * /reviews/report-review:
 *   post:
 *     tags: [Reviews]
 *     summary: Report a review for moderation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [review_id, reason]
 *             properties:
 *               review_id:
 *                 type: integer
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report submitted
 */
router.post(
  '/report-review',
  authMiddleware,
  validateRequest({ body: reportReviewSchema }),
  reviewController.reportReview.bind(reviewController)
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review
 *     responses:
 *       204:
 *         description: Review deleted
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  reviewController.deleteReview.bind(reviewController)
);

/**
 * @swagger
 * /reviews/update-status/{id}:
 *   patch:
 *     tags: [Reviews]
 *     summary: Update review moderation status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, remarks]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PendingReport, Approved, Reported, Flagged]
 *               remarks:
 *                 type: string
 *     responses:
 *       204:
 *         description: Status updated
 */
router.patch(
  '/update-status/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema, body: updateReviewSchema }),
  reviewController.updateStatus.bind(reviewController)
);

/**
 * @swagger
 * /reviews/reports/{toolId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reports for a tool (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: toolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: List of reported reviews
 */
router.get(
  '/reports/:tool_id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: toolIdParams }),
  existsMiddleware.toolExists,
  reviewController.getAllReports.bind(reviewController)
);

/**
 * @swagger
 * /reviews/report/{reportId}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review report (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     responses:
 *       204:
 *         description: Report deleted
 */
router.delete(
  '/report/:reportId',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: z.object({ reportId: z.coerce.number().positive() }) }),
  reviewController.deleteReport.bind(reviewController)
);

/**
 * @swagger
 * /reviews/status/bulk-update:
 *   patch:
 *     tags: [Reviews]
 *     summary: Bulk update review statuses (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reviews]
 *             properties:
 *               reviews:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id, status]
 *                   properties:
 *                     id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [PendingReport, Approved, Reported, Flagged]
 *     responses:
 *       200:
 *         description: Statuses updated
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/status/bulk-update',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkReviewStatusUpdateSchema }),
  reviewController.bulkUpdateStatus.bind(reviewController)
);

/**
 * @swagger
 * /reviews/status/bulk-delete:
 *   post:
 *     tags: [Reviews]
 *     summary: Bulk delete reviews (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Reviews deleted
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  '/status/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkReviewDeleteSchema }),
  reviewController.bulkDelete.bind(reviewController)
);

export default router;
