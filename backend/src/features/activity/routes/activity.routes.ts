import { Router } from 'express';
import { ActivityController } from '../controllers/activity.controller.ts';
import { ActivityService } from '../services/activity.service.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { RoleType } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const activityService = new ActivityService();
const activityController = new ActivityController(activityService);

const logActivitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  reference_id: z.number().optional(),
  entity_type: z.string().optional(),
  entity_name: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const getActivityFeedQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
  entity_type: z.string().optional(),
});

/**
 * @swagger
 * /activity/feed:
 *   get:
 *     summary: Get activity feed
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: entity_type
 *         schema:
 *           type: string
 *         description: Filter by entity type (tool, article, news, etc.)
 *     responses:
 *       200:
 *         description: Activity feed retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           description:
 *                             type: string
 *                           icon:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               username:
 *                                 type: string
 *                               first_name:
 *                                 type: string
 *                               last_name:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           timeAgo:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  '/feed',
  validateRequest({ query: getActivityFeedQuerySchema }),
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  activityController.getActivityFeed.bind(activityController)
);

/**
 * @swagger
 * /activity/log:
 *   post:
 *     summary: Log a new activity
 *     tags: [Activity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Activity title (e.g., "New Tool Submission")
 *               description:
 *                 type: string
 *                 description: Activity description (e.g., "ChatGPT Pro submitted for review")
 *               icon:
 *                 type: string
 *                 description: Icon emoji (e.g., "🛠️")
 *               user_id:
 *                 type: integer
 *                 description: User ID who performed the action
 *               reference_id:
 *                 type: integer
 *                 description: ID of the related entity
 *               entity_type:
 *                 type: string
 *                 description: Type of the referenced entity (tool, article, etc.)
 *               entity_name:
 *                 type: string
 *                 description: Name of the referenced entity
 *               metadata:
 *                 type: object
 *                 description: Additional metadata
 *     responses:
 *       201:
 *         description: Activity logged successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/log',
  validateRequest({ body: logActivitySchema }),
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  activityController.logActivity.bind(activityController)
);

export default router;
