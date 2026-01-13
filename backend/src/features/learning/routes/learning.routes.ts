import { Router } from 'express';
import { LearningController } from '@features/learning/controllers/learning.controller.ts';
import { LearningService } from '@features/learning/services/learning.service.ts';
import { authMiddleware, optionalAuthMiddleware } from '@middleware/auth.middleware.ts';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createLearningSchema,
  updateLearningSchema,
  learningIdParamSchema,
  getLearningsQuerySchema,
  bulkDeleteLearningsSchema,
  bulkUpdateLearningsSchema,
} from '@features/learning/validators/learning.validator.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();
const learningService = new LearningService(prisma);
const controller = new LearningController(learningService);

/**
 * @swagger
 * /learnings:
 *   get:
 *     tags: [Learnings]
 *     summary: Get all learnings
 *     description: Retrieve a paginated list of learnings
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Published, Scheduled]
 *       - in: query
 *         name: moderation_status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *       - in: query
 *         name: visibility
 *         schema:
 *           type: string
 *           enum: [Public, Private, Unlisted, FeaturedOnHomepage, IncludeInNewsletter]
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: skill_level
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search in title, description, and tags
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Learnings retrieved successfully
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
 *                     learnings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Learning'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get(
  '/',
  optionalAuthMiddleware,
  validateRequest({ query: getLearningsQuerySchema }),
  controller.getLearnings.bind(controller)
);

/**
 * @swagger
 * /learnings:
 *   post:
 *     tags: [Learnings]
 *     summary: Create a new learning
 *     description: Create a new learning (requires authentication)
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
 *               - url_slug
 *               - image
 *               - skill_level
 *               - lesson_link
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               url_slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Scheduled]
 *                 default: Draft
 *               moderation_status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *                 default: Pending
 *               skill_level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               lesson_link:
 *                 type: string
 *                 format: uri
 *               published_date:
 *                 type: string
 *                 format: date
 *               published_time:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private]
 *                 default: Public
 *               tags:
 *                 type: string
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *               secondary_category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 maxItems: 2
 *     responses:
 *       201:
 *         description: Learning created successfully
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
 *                   $ref: '#/components/schemas/Learning'
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createLearningSchema }),
  controller.createLearning.bind(controller)
);

/**
 * @swagger
 * /learnings/{id}:
 *   get:
 *     tags: [Learnings]
 *     summary: Get learning by ID
 *     description: Retrieve a specific learning by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Learning retrieved successfully
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
 *                   $ref: '#/components/schemas/Learning'
 *       404:
 *         description: Learning not found
 */
router.get(
  '/:id',
  validateRequest({ params: learningIdParamSchema }),
  controller.getLearningById.bind(controller)
);

/**
 * @swagger
 * /learnings/{id}:
 *   put:
 *     tags: [Learnings]
 *     summary: Update learning
 *     description: Update an existing learning (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               url_slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: uri
 *               is_featured:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Scheduled]
 *               moderation_status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *               skill_level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               lesson_link:
 *                 type: string
 *                 format: uri
 *               published_date:
 *                 type: string
 *                 format: date
 *               published_time:
 *                 type: string
 *                 pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private]
 *               tags:
 *                 type: string
 *               category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *               secondary_category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 maxItems: 2
 *     responses:
 *       200:
 *         description: Learning updated successfully
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
 *                   $ref: '#/components/schemas/Learning'
 */
router.put(
  '/:id',
  authMiddleware,
  validateRequest({ params: learningIdParamSchema, body: updateLearningSchema }),
  controller.updateLearning.bind(controller)
);

/**
 * @swagger
 * /learnings/{id}:
 *   delete:
 *     tags: [Learnings]
 *     summary: Delete learning
 *     description: Delete a learning (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Learning deleted successfully
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
 *                   $ref: '#/components/schemas/Learning'
 */
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: learningIdParamSchema }),
  controller.deleteLearning.bind(controller)
);

/**
 * @swagger
 * /learnings/bulk-delete:
 *   delete:
 *     tags: [Learnings]
 *     summary: Bulk delete learnings
 *     description: Delete multiple learnings at once (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learning_ids
 *             properties:
 *               learning_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *     responses:
 *       200:
 *         description: Learnings deleted successfully
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
 *                     deletedCount:
 *                       type: integer
 *                     deletedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     learnings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 */
router.delete(
  '/bulk-delete',
  authMiddleware,
  validateRequest({ body: bulkDeleteLearningsSchema }),
  controller.bulkDeleteLearnings.bind(controller)
);

/**
 * @swagger
 * /learnings/bulk-update:
 *   put:
 *     tags: [Learnings]
 *     summary: Bulk update learnings
 *     description: Update multiple learnings at once (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - learning_ids
 *             properties:
 *               learning_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Scheduled]
 *               moderation_status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private]
 *               is_featured:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Learnings updated successfully
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
 *                     updatedCount:
 *                       type: integer
 *                     updatedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                     learnings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 */
router.put(
  '/bulk-update',
  authMiddleware,
  validateRequest({ body: bulkUpdateLearningsSchema }),
  controller.bulkUpdateLearnings.bind(controller)
);

export default router;
