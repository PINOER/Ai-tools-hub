import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.ts';
import { CategoryService } from '../services/category.service.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import {
  updateCategorySchema,
  createCategorySchema,
  getCategoriesQuerySchema,
  bulkDeleteSectionCategoriesSchema,
} from '../validators/category.validator.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { RoleType, Section } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../../config/index.ts';

const router = Router();
const categoryService = new CategoryService(prisma);
const categoryController = new CategoryController(categoryService);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SectionEnum:
 *       type: string
 *       enum: [Tool, News, Article, Learning, Prompt, Glossary]
 *     CreateCategory:
 *       type: object
 *       required:
 *         - section
 *         - name
 *         - url_slug
 *       properties:
 *         section:
 *           $ref: '#/components/schemas/SectionEnum'
 *         name:
 *           type: string
 *           minLength: 1
 *         url_slug:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *         display_order:
 *           type: integer
 *         seo_title:
 *           type: string
 *         parentCategoryId:
 *           type: integer
 *           nullable: true
 *           description: ID of the parent category (must be in the same section)
 *     UpdateCategory:
 *       type: object
 *       properties:
 *         section:
 *           $ref: '#/components/schemas/SectionEnum'
 *         name:
 *           type: string
 *           minLength: 1
 *         url_slug:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *         display_order:
 *           type: integer
 *         seo_title:
 *           type: string
 *         parentCategoryId:
 *           type: integer
 *           nullable: true
 *           description: ID of the parent category (must be in the same section)
 *     BulkDeleteSectionCategories:
 *       type: object
 *       required:
 *         - categoryIds
 *         - section
 *       properties:
 *         categoryIds:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 1
 *           description: Array of category IDs to delete section associations for
 *         section:
 *           $ref: '#/components/schemas/SectionEnum'
 *           description: Section to delete category associations from
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategory'
 *           examples:
 *             rootCategory:
 *               summary: Create a root category
 *               value:
 *                 section: Tool
 *                 name: "AI Tools"
 *                 url_slug: "ai-tools"
 *                 description: "All AI tools"
 *                 display_order: 1
 *                 seo_title: "AI Tools"
 *             subCategory:
 *               summary: Create a subcategory
 *               value:
 *                 section: Tool
 *                 name: "Productivity Tools"
 *                 url_slug: "productivity-tools"
 *                 parentCategoryId: 1
 *                 description: "Productivity AI tools"
 *                 display_order: 2
 *                 seo_title: "Productivity Tools"
 *           description: |
 *             If parentCategoryId is provided, it must reference a category in the same section.
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error or parent not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: createCategorySchema }),
  categoryController.createCategory.bind(categoryController)
);

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: section
 *         schema:
 *           type: string
 *           enum: [Tool, News, Article, Learning, Prompt, Glossary]
 *         description: Filter categories by section
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search categories by name (case-insensitive)
 *     responses:
 *       200:
 *         description: List of categories with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       section:
 *                         $ref: '#/components/schemas/SectionEnum'
 *                       name:
 *                         type: string
 *                       url_slug:
 *                         type: string
 *                       description:
 *                         type: string
 *                       display_order:
 *                         type: integer
 *                       seo_title:
 *                         type: string
 *                       parentCategoryId:
 *                         type: integer
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
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
 *         description: Forbidden - Admin access required
 */
router.get(
  '/',
  validateRequest({ query: getCategoriesQuerySchema }),
  categoryController.getAllCategories.bind(categoryController)
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get a category by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  categoryController.getCategory.bind(categoryController)
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *           example:
 *             section: Tool
 *             name: "Updated Category"
 *             url_slug: "updated-category"
 *             description: "Updated description"
 *             display_order: 2
 *             seo_title: "Updated SEO Title"
 *             parentCategoryId: 1
 *           description: |
 *             If parentCategoryId is provided, it must reference a category in the same section.
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Validation error or parent error
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema, body: updateCategorySchema }),
  categoryController.updateCategory.bind(categoryController)
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       400:
 *         description: Cannot delete due to existing subcategories
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  categoryController.deleteCategory.bind(categoryController)
);

/**
 * @swagger
 * /categories/{id}/section-categories:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete section category associations for a specific category
 *     description: Deletes all section category associations for a specific category. The system will check if the category is currently in use by any items. If the category is in use and force=false, the operation will be blocked. Use force=true to override this safety check.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *       - in: query
 *         name: section
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/SectionEnum'
 *         description: Section to delete category associations from
 *       - in: query
 *         name: force
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Force deletion even if category is in use, default false
 *     responses:
 *       200:
 *         description: Section category associations deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *                 wasInUse:
 *                   type: boolean
 *                 details:
 *                   type: string
 *       400:
 *         description: Category not found, section mismatch, or category is in use (when force=false)
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete(
  '/:id/section-categories',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({
    params: idParamSchema,
    query: z.object({
      section: z.nativeEnum(Section),
      force: z
        .string()
        .optional()
        .transform((val) => val === 'true'),
    }),
  }),
  categoryController.deleteSectionCategory.bind(categoryController)
);

/**
 * @swagger
 * /categories/bulk-delete-section-categories:
 *   delete:
 *     tags: [Categories]
 *     summary: Bulk delete section category associations for multiple categories
 *     description: Deletes section category associations for multiple categories at once. The system will check if any categories are currently in use by items. If any categories are in use and force=false, the operation will be blocked. Use force=true to override this safety check.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: force
 *         required: false
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Force deletion even if categories are in use, default false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BulkDeleteSectionCategories'
 *           example:
 *             categoryIds: [1, 2, 3]
 *             section: Tool
 *     responses:
 *       200:
 *         description: Section category associations deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCount:
 *                   type: integer
 *                 categoryCount:
 *                   type: integer
 *                 section:
 *                   $ref: '#/components/schemas/SectionEnum'
 *                 wasInUse:
 *                   type: boolean
 *                 totalUsageBeforeDeletion:
 *                   type: integer
 *       400:
 *         description: Validation error, categories not found in specified section, or categories are in use (when force=false)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete(
  '/bulk-delete-section-categories',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({
    body: bulkDeleteSectionCategoriesSchema,
    query: z.object({
      force: z
        .string()
        .optional()
        .transform((val) => val === 'true'),
    }),
  }),
  categoryController.bulkDeleteSectionCategories.bind(categoryController)
);

export default router;
