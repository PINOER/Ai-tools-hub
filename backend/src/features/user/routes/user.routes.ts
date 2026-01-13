import { Router } from 'express';
import { UserController } from '../controllers/user.controller.ts';
import { UserService } from '../services/user.service.ts';
import { RoleType } from '@prisma/client';
import {
  updateUserSchema,
  createUserSchema,
  bulkUserStatusUpdateSchema,
  bulkUserDeleteSchema,
  getUsersQuerySchema,
  checkUsernameSchema,
  updateUserPreferencesSchema,
} from '../validators/user.validator.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

/**
 * @swagger
 * /users/check-username:
 *   post:
 *     summary: Check if username exists
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 description: Username to check
 *     responses:
 *       200:
 *         description: Username availability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username that was checked
 *                 exists:
 *                   type: boolean
 *                   description: Whether the username already exists
 *                 available:
 *                   type: boolean
 *                   description: Whether the username is available for use
 *       400:
 *         description: Validation error
 */
router.post(
  '/check-username',
  validateRequest({ body: checkUsernameSchema }),
  userController.checkUsername.bind(userController)
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
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
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for username, first name, last name, or email
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive, Banned, Suspended, Deleted, Pending]
 *         description: Filter by user status
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Admin, Moderator, User, Contributor]
 *         description: Filter by user role
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                         nullable: true
 *                       bio:
 *                         type: string
 *                         nullable: true
 *                       provider:
 *                         type: string
 *                         nullable: true
 *                       moderation_notes:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       role:
 *                         type: object
 *                         properties:
 *                           role:
 *                             type: string
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  validateRequest({ query: getUsersQuerySchema }),
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  userController.getAllUsers.bind(userController)
);

/**
 * @swagger
 * /users/preferences:
 *   get:
 *     summary: Get user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newsletter_subscribed:
 *                   type: boolean
 *                   description: Whether user is subscribed to newsletter
 *                 email_notifications:
 *                   type: boolean
 *                   description: Whether user wants email notifications
 *                 search_alerts:
 *                   type: boolean
 *                   description: Whether user wants search alerts
 *       401:
 *         description: Unauthorized
 */
router.get('/preferences', authMiddleware, userController.getUserPreferences.bind(userController));

/**
 * @swagger
 * /users/preferences:
 *   patch:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newsletter_subscribed:
 *                 type: boolean
 *                 description: Whether user wants to subscribe to newsletter
 *               email_notifications:
 *                 type: boolean
 *                 description: Whether user wants email notifications
 *               search_alerts:
 *                 type: boolean
 *                 description: Whether user wants search alerts
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 newsletter_subscribed:
 *                   type: boolean
 *                 email_notifications:
 *                   type: boolean
 *                 search_alerts:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch(
  '/preferences',
  authMiddleware,
  validateRequest({ body: updateUserPreferencesSchema }),
  userController.updateUserPreferences.bind(userController)
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  userController.getUser.bind(userController)
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - role
 *               - status
 *               - avatar
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [Admin, Moderator, User, Contributor]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Banned, Suspended, Deleted, Pending]
 *                 default: Active
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: User avatar URL (required)

 *               bio:
 *                 type: string
 *                 nullable: true
 *               moderation_notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: createUserSchema }),
  userController.createUser.bind(userController)
);

/**
 * 
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [Admin, Moderator, User, Contributor]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Banned, Suspended, Deleted, Pending]
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 nullable: true

 *               bio:
 *                 type: string
 *                 nullable: true
 *               moderation_notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema, body: updateUserSchema }),
  userController.updateUser.bind(userController)
);

/**
 * @swagger
 * /users/status/bulk-update:
 *   patch:
 *     summary: Bulk update user statuses (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [users]
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id, status]
 *                   properties:
 *                     id:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive, Banned, Suspended, Deleted, Pending]
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
  validateRequest({ body: bulkUserStatusUpdateSchema }),
  userController.bulkUpdateStatus.bind(userController)
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  userController.deleteUser.bind(userController)
);

/**
 * @swagger
 * /users/bulk-delete:
 *   post:
 *     summary: Bulk delete users (admin only)
 *     tags: [Users]
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
 *         description: Users deleted
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  '/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkUserDeleteSchema }),
  userController.bulkDelete.bind(userController)
);

export default router;
