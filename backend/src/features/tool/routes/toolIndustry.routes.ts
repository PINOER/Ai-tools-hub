import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createToolIndustrySchema,
  updateToolIndustrySchema,
  getToolIndustriesQuerySchema,
  toolIndustryIdParamSchema,
} from '../validators/toolIndustry.validator.ts';
import { authMiddleware, roleMiddleware } from '@middleware/auth.middleware.ts';
import { ToolIndustryController } from '../controllers/toolIndustry.controller.ts';
import { ToolIndustryService } from '../services/toolIndustry.service.ts';
import { RoleType } from '@prisma/client';
import { prisma } from '../../../config/index.ts';

const router = Router();

const toolIndustryService = new ToolIndustryService(prisma);
const toolIndustryController = new ToolIndustryController(toolIndustryService);

/**
 * @swagger
 * /tool-industries:
 *   post:
 *     tags: [Tool Industries]
 *     summary: Create a new tool industry
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
 *                 description: Name of the tool industry
 *     responses:
 *       201:
 *         description: Tool industry created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: createToolIndustrySchema }),
  toolIndustryController.createToolIndustry.bind(toolIndustryController)
);

/**
 * @swagger
 * /tool-industries:
 *   get:
 *     tags: [Tool Industries]
 *     summary: Get all tool industries
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
 *         description: Search term for industry name
 *     responses:
 *       200:
 *         description: Tool industries retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateRequest({ query: getToolIndustriesQuerySchema }),
  toolIndustryController.getAllToolIndustries.bind(toolIndustryController)
);

/**
 * @swagger
 * /tool-industries/{id}:
 *   get:
 *     tags: [Tool Industries]
 *     summary: Get a tool industry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool industry ID
 *     responses:
 *       200:
 *         description: Tool industry retrieved successfully
 *       404:
 *         description: Tool industry not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  validateRequest({ params: toolIndustryIdParamSchema }),
  toolIndustryController.getToolIndustry.bind(toolIndustryController)
);

/**
 * @swagger
 * /tool-industries/{id}:
 *   put:
 *     tags: [Tool Industries]
 *     summary: Update a tool industry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool industry ID
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
 *                 description: Name of the tool industry
 *     responses:
 *       200:
 *         description: Tool industry updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tool industry not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: toolIndustryIdParamSchema, body: updateToolIndustrySchema }),
  toolIndustryController.updateToolIndustry.bind(toolIndustryController)
);

/**
 * @swagger
 * /tool-industries/{id}:
 *   delete:
 *     tags: [Tool Industries]
 *     summary: Delete a tool industry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool industry ID
 *     responses:
 *       204:
 *         description: Tool industry deleted successfully
 *       404:
 *         description: Tool industry not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: toolIndustryIdParamSchema }),
  toolIndustryController.deleteToolIndustry.bind(toolIndustryController)
);

export default router;
