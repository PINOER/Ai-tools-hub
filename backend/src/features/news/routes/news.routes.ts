import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createNewsSchema,
  getNewsQuerySchema,
  updateNewsSchema,
  bulkDeleteNewsSchema,
  bulkUpdateNewsModerationStatusSchema,
  updateNewsModerationStatusSchema,
  idParamSchema,
} from '../validators/news.validator.ts';
import {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
} from '@middleware/auth.middleware.ts';
import { NewsController } from '../controllers/news.controller.ts';
import { RoleType } from '@prisma/client';
import { NewsService } from '../services/news.service.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();

const categoryService = new CategoryService(prisma);
const tagService = new TagService(prisma);
const newsService = new NewsService(categoryService, tagService, prisma);
const newsController = new NewsController(newsService);

/**
 * @swagger
 * /news:
 *   post:
 *     tags: [News]
 *     summary: Create a new news article
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
 *               seo_title:
 *                 type: string
 *                 maxLength: 60
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
 *                 format: date-time
 *               published_time:
 *                 type: string
 *                 format: date-time
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private, Unlisted, FeaturedOnHomepage, IncludeInNewsletter]
 *                 default: Public
 *               allow_comments:
 *                 type: boolean
 *                 default: false
 *                 description: Whether comments are allowed on this news article
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
 *               tag_names:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: News article created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createNewsSchema }),
  newsController.createNews.bind(newsController)
);

/**
 * @swagger
 * /news:
 *   get:
 *     tags: [News]
 *     summary: Get all news articles
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category_ids
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag_names
 *         schema:
 *           type: string
 *       - in: query
 *         name: published_after
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: published_before
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: sort_field
 *         schema:
 *           type: string
 *           enum: [published_date, created_at, updated_at, headline]
 *     responses:
 *       200:
 *         description: List of news articles
 *       400:
 *         description: Bad request
 */
router.get(
  '/',
  optionalAuthMiddleware,
  validateRequest({ query: getNewsQuerySchema }),
  newsController.getAllNews.bind(newsController)
);

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Get a specific news article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News article details
 *       404:
 *         description: News article not found
 */
router.get(
  '/:id',
  optionalAuthMiddleware,
  validateRequest({ params: idParamSchema }),
  newsController.getNews.bind(newsController)
);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     tags: [News]
 *     summary: Update a news article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               headline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               seo_title:
 *                 type: string
 *                 maxLength: 60
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
 *                 format: date-time
 *               published_time:
 *                 type: string
 *                 format: date-time
 *               visibility:
 *                 type: string
 *                 enum: [Public, Private, Unlisted, FeaturedOnHomepage, IncludeInNewsletter]
 *               allow_comments:
 *                 type: boolean
 *                 description: Whether comments are allowed on this news article
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
 *               tag_names:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: News article updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News article not found
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  validateRequest({ params: idParamSchema, body: updateNewsSchema }),
  newsController.updateNews.bind(newsController)
);

/**
 * @swagger
 * /news/bulk-moderation:
 *   patch:
 *     tags: [News]
 *     summary: Bulk update news articles moderation status
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - news_ids
 *               - moderation_status
 *             properties:
 *               news_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of news article IDs
 *               moderation_status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *     responses:
 *       200:
 *         description: News articles moderation status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: One or more news articles not found
 */
router.patch(
  '/bulk-moderation',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  validateRequest({ body: bulkUpdateNewsModerationStatusSchema }),
  newsController.bulkUpdateNewsModerationStatus.bind(newsController)
);

/**
 * @swagger
 * /news/{id}/moderation:
 *   patch:
 *     tags: [News]
 *     summary: Update news article moderation status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moderation_status
 *             properties:
 *               moderation_status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *     responses:
 *       200:
 *         description: News article moderation status updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News article not found
 */
router.patch(
  '/:id/moderation',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  validateRequest({ params: idParamSchema, body: updateNewsModerationStatusSchema }),
  newsController.updateNewsModerationStatus.bind(newsController)
);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     tags: [News]
 *     summary: Delete a news article
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: News article deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: News article not found
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  validateRequest({ params: idParamSchema }),
  newsController.deleteNews.bind(newsController)
);

/**
 * @swagger
 * /news/bulk-delete:
 *   delete:
 *     tags: [News]
 *     summary: Bulk delete news articles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - news_ids
 *             properties:
 *               news_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *     responses:
 *       200:
 *         description: News articles deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete(
  '/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkDeleteNewsSchema }),
  newsController.bulkDeleteNews.bind(newsController)
);

export default router;
