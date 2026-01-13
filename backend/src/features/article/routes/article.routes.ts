import { Router } from 'express';
import { ArticleController } from '@features/article/controllers/article.controller.ts';
import { ArticleService } from '@features/article/services/article.service.ts';
import { authMiddleware, optionalAuthMiddleware } from '@middleware/auth.middleware.ts';
import { validateRequest } from '@middleware/validation.middleware.ts';

import {
  createArticleSchema,
  updateArticleSchema,
  articleIdParamSchema,
  getArticlesQuerySchema,
  bulkDeleteArticlesSchema,
  bulkUpdateArticlesSchema,
} from '@features/article/validators/article.validator.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();
const articleService = new ArticleService(prisma);
const controller = new ArticleController(articleService);

/**
 * @swagger
 * /articles:
 *   get:
 *     tags: [Articles]
 *     summary: Get all articles
 *     description: Retrieve a paginated list of articles
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
 *         name: category_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search in headline, content, and tags
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
 *         description: Articles retrieved successfully
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
 *                     articles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Article'
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
  validateRequest({ query: getArticlesQuerySchema }),
  controller.getArticles.bind(controller)
);

/**
 * @swagger
 * /articles:
 *   post:
 *     tags: [Articles]
 *     summary: Create a new article
 *     description: Create a new article (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - headline
 *               - url_slug
 *               - content
 *             properties:
 *               headline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               url_slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 1
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
 *         description: Article created successfully
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
 *                   $ref: '#/components/schemas/Article'
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createArticleSchema }),
  controller.createArticle.bind(controller)
);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     tags: [Articles]
 *     summary: Get article by ID
 *     description: Retrieve a specific article by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Article retrieved successfully
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
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 */
router.get(
  '/:id',
  validateRequest({ params: articleIdParamSchema }),
  controller.getArticleById.bind(controller)
);

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     tags: [Articles]
 *     summary: Update article
 *     description: Update an existing article (requires authentication)
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
 *               headline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               url_slug:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 minLength: 1
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
 *         description: Article updated successfully
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
 *                   $ref: '#/components/schemas/Article'
 */
router.put(
  '/:id',
  authMiddleware,
  validateRequest({ params: articleIdParamSchema, body: updateArticleSchema }),
  controller.updateArticle.bind(controller)
);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     tags: [Articles]
 *     summary: Delete article
 *     description: Delete an article (requires authentication)
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
 *         description: Article deleted successfully
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
 *                   $ref: '#/components/schemas/Article'
 */
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: articleIdParamSchema }),
  controller.deleteArticle.bind(controller)
);

/**
 * @swagger
 * /articles/bulk-delete:
 *   delete:
 *     tags: [Articles]
 *     summary: Bulk delete articles
 *     description: Delete multiple articles at once (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - article_ids
 *             properties:
 *               article_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *     responses:
 *       200:
 *         description: Articles deleted successfully
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
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           headline:
 *                             type: string
 */
router.delete(
  '/bulk-delete',
  authMiddleware,
  validateRequest({ body: bulkDeleteArticlesSchema }),
  controller.bulkDeleteArticles.bind(controller)
);

/**
 * @swagger
 * /articles/bulk-update:
 *   put:
 *     tags: [Articles]
 *     summary: Bulk update articles
 *     description: Update multiple articles at once (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - article_ids
 *             properties:
 *               article_ids:
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
 *         description: Articles updated successfully
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
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           headline:
 *                             type: string
 */
router.put(
  '/bulk-update',
  authMiddleware,
  validateRequest({ body: bulkUpdateArticlesSchema }),
  controller.bulkUpdateArticles.bind(controller)
);

export default router;
