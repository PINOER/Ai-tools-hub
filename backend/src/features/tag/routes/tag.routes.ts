import { Router } from 'express';
import { TagController } from '../controllers/tag.controller.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { createTagSchema, getTagsQuerySchema } from '../validators/tag.validator.ts';
import { TagService } from '../services/tag.service.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { RoleType } from '@prisma/client';
import { prisma } from '../../../config/index.ts';

const router = Router();
const tagController = new TagController(new TagService(prisma));

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag management
 */

/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a new tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: createTagSchema }),
  tagController.createTag.bind(tagController)
);

/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: Get all tags
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
 *         description: Search term for tag name
 *     responses:
 *       200:
 *         description: List of all tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       tool_count:
 *                         type: integer
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
 */
router.get(
  '/',
  validateRequest({ query: getTagsQuerySchema }),
  tagController.getAllTags.bind(tagController)
);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     tags: [Tags]
 *     summary: Get a tag by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  tagController.getTag.bind(tagController)
);

/**
 * @swagger
 * /tags/{id}:
 *   patch:
 *     tags: [Tags]
 *     summary: Update a tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *     responses:
 *       200:
 *         description: Tag updated
 *       404:
 *         description: Tag not found
 */
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema, body: createTagSchema }),
  tagController.updateTag.bind(tagController)
);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Tags]
 *     summary: Delete a tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag deleted
 *       404:
 *         description: Tag not found
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  tagController.deleteTag.bind(tagController)
);

export default router;
