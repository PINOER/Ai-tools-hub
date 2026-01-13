// src/routes/tool.routes.ts
import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createToolSchema,
  getToolsQuerySchema,
  ToolStatusEnum,
  updateToolSchema,
  bulkDeleteToolsSchema,
} from '../validators/tool.validator.ts';
import {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
} from '@middleware/auth.middleware.ts';
import { ToolController } from '../controllers/tool.controller.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { RoleType } from '@prisma/client';
import { z } from 'zod';
import { ToolService } from '../services/tool.service.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ToolSubmissionService } from '../services/toolSubmission.service.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();

const categoryService = new CategoryService(prisma);
const tagService = new TagService(prisma);
const toolSubmissionService = new ToolSubmissionService(prisma);

const toolService = new ToolService(categoryService, tagService, toolSubmissionService, prisma);
const toolController = new ToolController(toolService);

/**
 * @swagger
 * /tools:
 *   post:
 *     tags: [Tools]
 *     summary: Create a new tool
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
 *               - short_description
 *               - website_url
 *               - is_unique
 *               - avatar
 *               - seo_meta_title
 *               - seo_meta_description
 *               - pricing_model
 *               - free_plan_details
 *               - paid_plan_details
 *               - platform_availability
 *               - full_description
 *               - use_cases
 *               - features
 *               - screenshots
 *               - category_id
 *               - secondary_category_ids
 *               - seo_meta_title
 *               - seo_meta_description
 *               - pricing_model
 *               - free_plan_available
 *               - free_plan_details
 *               - paid_plan_details
 *               - platform_availability
 *               - full_description
 *               - use_cases
 *               - features
 *               - screenshots
 *               - tool_role_ids
 *               - tool_industry_ids
 *               - tool_tags
 *               - is_unique
 *               - social_links
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               short_description:
 *                 type: string
 *                 minLength: 1
 *               website_url:
 *                 type: string
 *                 format: uri
 *               avatar:
 *                 type: string
 *                 format: uri
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: Primary category ID
 *               secondary_category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 maxItems: 2
 *                 description: Secondary category IDs (max 2)
 *               seo_meta_title:
 *                 type: string
 *                 maxLength: 60
 *               seo_meta_description:
 *                 type: string
 *                 maxLength: 160
 *               pricing_model:
 *                 type: string
 *                 enum: [Free, Paid, Freemium, Subscription, PaidOnly, OneTimePurchase]
 *               free_plan_available:
 *                 type: boolean
 *                 default: false
 *               free_plan_details:
 *                 type: string
 *                 description: Details about the free plan
 *               paid_plan_details:
 *                 type: string
 *                 description: Details about the paid plan
 *               platform_availability:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Web, Desktop, MobileApp, BrowserExtension, Api]
 *               full_description:
 *                 type: string
 *                 description: Detailed description of the tool
 *               use_cases:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of use cases for the tool
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tool features
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: Array of screenshot URLs
 *               tool_role_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 description: Array of tool role IDs
 *               tool_industry_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 description: Array of tool industry IDs
 *               tool_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tag names
 *               is_unique:
 *                 type: boolean
 *                 description: Whether the tool is unique
 *               social_links:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - platform
 *                     - url
 *                   properties:
 *                     platform:
 *                       type: string
 *                       minLength: 1
 *                       description: Social media platform name
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: Social media profile URL
 *     responses:
 *       201:
 *         description: Tool created successfully
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
  validateRequest({ body: createToolSchema }),
  toolController.createTool.bind(toolController)
);

/**
 * @swagger
 * /tools/{id}:
 *   get:
 *     tags: [Tools]
 *     summary: Get a tool by ID (Public API - returns only approved tools, Admin API - returns all tools)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tool retrieved successfully
 *       404:
 *         description: Tool not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  optionalAuthMiddleware,
  validateRequest({ params: idParamSchema }),
  toolController.getTool.bind(toolController)
);

/**
 * @swagger
 * /tools/bulk-delete:
 *   post:
 *     tags: [Tools]
 *     summary: Bulk delete multiple tools (Admin only)
 *     description: Delete multiple tools and all their related records in a single transaction. All tool IDs must exist.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tool_ids
 *             properties:
 *               tool_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *                 description: Array of tool IDs to delete (1-50 tools)
 *           example:
 *             tool_ids: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Tools deleted successfully
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
 *                       description: Number of tools deleted
 *                     deletedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       description: Array of deleted tool IDs
 *       400:
 *         description: Validation error or some tools not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkDeleteToolsSchema }),
  toolController.bulkDeleteTools.bind(toolController)
);

/**
 * @swagger
 * /tools/{id}:
 *   delete:
 *     tags: [Tools]
 *     summary: Delete a tool (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool ID
 *     responses:
 *       200:
 *         description: Tool deleted successfully
 *       404:
 *         description: Tool not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  toolController.deleteTool.bind(toolController)
);

/**
 * @swagger
 * /tools/{id}:
 *   patch:
 *     tags: [Tools]
 *     summary: Update a tool
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool ID
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
 *                 maxLength: 255
 *               short_description:
 *                 type: string
 *                 minLength: 1
 *               website_url:
 *                 type: string
 *                 format: uri
 *               avatar:
 *                 type: string
 *                 format: uri
 *               is_featured:
 *                 type: boolean
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: Primary category ID
 *               secondary_category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 maxItems: 2
 *                 description: Secondary category IDs (max 2)
 *               seo_meta_title:
 *                 type: string
 *                 maxLength: 60
 *               seo_meta_description:
 *                 type: string
 *                 maxLength: 160
 *               pricing_model:
 *                 type: string
 *                 enum: [Free, Paid, Freemium, Subscription, PaidOnly, OneTimePurchase]
 *               free_plan_available:
 *                 type: boolean
 *               free_plan_details:
 *                 type: string
 *                 description: Details about the free plan
 *               paid_plan_details:
 *                 type: string
 *                 description: Details about the paid plan
 *               platform_availability:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Web, Desktop, MobileApp, BrowserExtension, Api]
 *               full_description:
 *                 type: string
 *                 description: Detailed description of the tool
 *               use_cases:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of use cases for the tool
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tool features
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: Array of screenshot URLs
 *               tool_role_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 description: Array of tool role IDs
 *               tool_industry_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 description: Array of tool industry IDs
 *               tool_tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of tag names
 *               is_unique:
 *                 type: boolean
 *                 description: Whether the tool is unique
 *               social_links:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - platform
 *                     - url
 *                   properties:
 *                     platform:
 *                       type: string
 *                       minLength: 1
 *                       description: Social media platform name
 *                     url:
 *                       type: string
 *                       format: uri
 *                       description: Social media profile URL
 *     responses:
 *       200:
 *         description: Tool updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tool not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authMiddleware,
  validateRequest({ params: idParamSchema, body: updateToolSchema }),
  toolController.updateTool.bind(toolController)
);

/**
 * @swagger
 * /tools:
 *   get:
 *     tags: [Tools]
 *     summary: Get all tools (Public API - returns only approved tools, Admin API - returns all tools based on status)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *           default: "1"
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *           default: "10"
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter by status (Admin only)
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Filter by category ID
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Filter by user ID (Admin only)
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by featured status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, description, or full description
 *       - in: query
 *         name: tag_ids
 *         schema:
 *           type: string
 *           pattern: ^\d+(,\d+)*$
 *         description: Filter by tag IDs (comma-separated)
 *         example: "1,2,3"
 *       - in: query
 *         name: pricing_model
 *         schema:
 *           type: string
 *           pattern: ^[A-Za-z]+(,[A-Za-z]+)*$
 *         description: Filter by pricing model (comma-separated)
 *         example: "Free,Paid,Freemium"
 *       - in: query
 *         name: platform_availability
 *         schema:
 *           type: string
 *           pattern: ^[A-Za-z]+(,[A-Za-z]+)*$
 *         description: Filter by platform availability (comma-separated)
 *         example: "Web,MobileApp"
 *       - in: query
 *         name: is_claimed
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by claimed status
 *       - in: query
 *         name: tool_role_ids
 *         schema:
 *           type: string
 *           pattern: ^\d+(,\d+)*$
 *         description: Filter by tool role IDs (comma-separated)
 *         example: "1,2,3"
 *       - in: query
 *         name: tool_industry_ids
 *         schema:
 *           type: string
 *           pattern: ^\d+(,\d+)*$
 *         description: Filter by tool industry IDs (comma-separated)
 *         example: "1,2,3"
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: ["asc", "desc"]
 *           default: "desc"
 *         description: Sort by creation date (asc = oldest first, desc = newest first)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tools retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required for certain filters
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  optionalAuthMiddleware,
  validateRequest({ query: getToolsQuerySchema }),
  toolController.getAllTools.bind(toolController)
);

/**
 * @swagger
 * /tools/{id}/status:
 *   patch:
 *     tags: [Tools]
 *     summary: Update tool status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *     responses:
 *       200:
 *         description: Tool status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Tool not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({
    params: idParamSchema,
    body: z.object({
      status: ToolStatusEnum,
    }),
  }),
  toolController.updateToolStatus.bind(toolController)
);

export default router;
