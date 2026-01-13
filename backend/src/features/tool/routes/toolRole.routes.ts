import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createToolRoleSchema,
  updateToolRoleSchema,
  getToolRolesQuerySchema,
  toolRoleIdParamSchema,
} from '../validators/toolRole.validator.ts';
import { authMiddleware, roleMiddleware } from '@middleware/auth.middleware.ts';
import { ToolRoleController } from '../controllers/toolRole.controller.ts';
import { ToolRoleService } from '../services/toolRole.service.ts';
import { RoleType } from '@prisma/client';
import { prisma } from '../../../config/index.ts';

const router = Router();

const toolRoleService = new ToolRoleService(prisma);
const toolRoleController = new ToolRoleController(toolRoleService);

/**
 * @swagger
 * /tool-roles:
 *   post:
 *     tags: [Tool Roles]
 *     summary: Create a new tool role
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
 *                 description: Name of the tool role
 *     responses:
 *       201:
 *         description: Tool role created successfully
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
  validateRequest({ body: createToolRoleSchema }),
  toolRoleController.createToolRole.bind(toolRoleController)
);

/**
 * @swagger
 * /tool-roles:
 *   get:
 *     tags: [Tool Roles]
 *     summary: Get all tool roles
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
 *         description: Search term for role name
 *     responses:
 *       200:
 *         description: Tool roles retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateRequest({ query: getToolRolesQuerySchema }),
  toolRoleController.getAllToolRoles.bind(toolRoleController)
);

/**
 * @swagger
 * /tool-roles/{id}:
 *   get:
 *     tags: [Tool Roles]
 *     summary: Get a tool role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool role ID
 *     responses:
 *       200:
 *         description: Tool role retrieved successfully
 *       404:
 *         description: Tool role not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  validateRequest({ params: toolRoleIdParamSchema }),
  toolRoleController.getToolRole.bind(toolRoleController)
);

/**
 * @swagger
 * /tool-roles/{id}:
 *   put:
 *     tags: [Tool Roles]
 *     summary: Update a tool role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool role ID
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
 *                 description: Name of the tool role
 *     responses:
 *       200:
 *         description: Tool role updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tool role not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: toolRoleIdParamSchema, body: updateToolRoleSchema }),
  toolRoleController.updateToolRole.bind(toolRoleController)
);

/**
 * @swagger
 * /tool-roles/{id}:
 *   delete:
 *     tags: [Tool Roles]
 *     summary: Delete a tool role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tool role ID
 *     responses:
 *       204:
 *         description: Tool role deleted successfully
 *       404:
 *         description: Tool role not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: toolRoleIdParamSchema }),
  toolRoleController.deleteToolRole.bind(toolRoleController)
);

export default router;
