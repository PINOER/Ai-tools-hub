import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.ts';
import { NotificationService } from '../services/notification.service.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { RoleType, NotificationType } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const notificationService = new NotificationService();
const notificationController = new NotificationController(notificationService);

const getNotificationsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.nativeEnum(NotificationType).optional(),
  unread_only: z.string().optional(),
});

const createNotificationSchema = z.object({
  user_id: z.number().int().positive(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1).max(255),
  message: z.string().min(1),
  action_url: z.string().optional(),
  entity_type: z.string().optional(),
  entity_id: z.number().int().positive().optional(),
});

const notificationIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const pusherAuthSchema = z.object({
  socket_id: z.string().min(1, 'Socket ID is required'),
  channel_name: z.string().min(1, 'Channel name is required'),
});

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
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
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [System, Update, Newsletter, Review]
 *         description: Filter by notification type
 *       - in: query
 *         name: unread_only
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Show only unread notifications
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
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
 *                     notifications:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           type:
 *                             type: string
 *                             enum: [System, Update, Newsletter, Review]
 *                           title:
 *                             type: string
 *                           message:
 *                             type: string
 *                           read:
 *                             type: boolean
 *                           action_url:
 *                             type: string
 *                             description: URL to navigate when notification is clicked
 *                             example: /tools/123
 *                           entity_type:
 *                             type: string
 *                             description: Type of related entity
 *                             example: tool
 *                           entity_id:
 *                             type: integer
 *                             description: ID of the related entity
 *                             example: 123
 *                           timeAgo:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
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
 *                     unread_count:
 *                       type: integer
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
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateRequest({ query: getNotificationsQuerySchema }),
  authMiddleware,
  notificationController.getNotifications.bind(notificationController)
);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get a specific notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  validateRequest({ params: notificationIdParamSchema }),
  authMiddleware,
  notificationController.getNotificationById.bind(notificationController)
);

/**
 * @swagger
 * /notifications/unread/count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
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
 *                     count:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/unread/count',
  authMiddleware,
  notificationController.getUnreadCount.bind(notificationController)
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/read',
  validateRequest({ params: notificationIdParamSchema }),
  authMiddleware,
  notificationController.markAsRead.bind(notificationController)
);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   patch:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/mark-all-read',
  authMiddleware,
  notificationController.markAllAsRead.bind(notificationController)
);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  validateRequest({ params: notificationIdParamSchema }),
  authMiddleware,
  notificationController.deleteNotification.bind(notificationController)
);

/**
 * @swagger
 * /notifications/admin/all:
 *   get:
 *     summary: Get all notifications (Admin only)
 *     tags: [Notifications - Admin]
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
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [System, Update, Newsletter, Review]
 *         description: Filter by notification type
 *     responses:
 *       200:
 *         description: All notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/admin/all',
  validateRequest({ query: getNotificationsQuerySchema }),
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  notificationController.getAdminNotifications.bind(notificationController)
);

/**
 * @swagger
 * /notifications/admin/create:
 *   post:
 *     summary: Create a notification (Admin only)
 *     tags: [Notifications - Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - type
 *               - title
 *               - message
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to notify
 *               type:
 *                 type: string
 *                 enum: [System, Update, Newsletter, Review]
 *                 description: Type of notification
 *               title:
 *                 type: string
 *                 description: Notification title
 *                 maxLength: 255
 *               message:
 *                 type: string
 *                 description: Notification message
 *               action_url:
 *                 type: string
 *                 description: URL to navigate when notification is clicked (optional)
 *                 example: /tools/123
 *               entity_type:
 *                 type: string
 *                 description: Type of related entity (optional)
 *                 example: tool
 *               entity_id:
 *                 type: integer
 *                 description: ID of the related entity (optional)
 *                 example: 123
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/admin/create',
  validateRequest({ body: createNotificationSchema }),
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  notificationController.createNotification.bind(notificationController)
);

/**
 * @swagger
 * /notifications/admin/stats:
 *   get:
 *     summary: Get notification statistics (Admin only)
 *     tags: [Notifications - Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics retrieved successfully
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
 *                     total:
 *                       type: integer
 *                     unread_total:
 *                       type: integer
 *                     by_type:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                           count:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/admin/stats',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  notificationController.getNotificationStats.bind(notificationController)
);

/**
 * @swagger
 * /notifications/pusher/auth:
 *   post:
 *     summary: Authenticate user for Pusher private channels
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - socket_id
 *               - channel_name
 *             properties:
 *               socket_id:
 *                 type: string
 *                 description: Socket ID from Pusher client
 *                 example: "123456.7890123"
 *               channel_name:
 *                 type: string
 *                 description: Private channel name to authenticate for
 *                 example: private-user-123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 auth:
 *                   type: string
 *                   description: Authentication signature
 *                   example: "app_key:signature_hash"
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       403:
 *         description: Forbidden - Cannot authenticate for this channel
 *       500:
 *         description: Internal server error
 */
router.post(
  '/pusher/auth',
  authMiddleware,
  validateRequest({ body: pusherAuthSchema }),
  notificationController.authenticatePusher.bind(notificationController)
);

export default router;
