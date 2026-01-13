import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import { authMiddleware } from '@middleware/auth.middleware.ts';
import { BookmarkController } from '../controllers/bookmark.controller.ts';
import { BookmarkService } from '../services/bookmark.service.ts';
import {
  createBookmarkSchema,
  getBookmarksQuerySchema,
  idParamSchema,
} from '../validators/bookmark.validator.ts';

const router = Router();
const service = new BookmarkService();
const controller = new BookmarkController(service);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Create a bookmark (save item)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [target_id, target_type]
 *             properties:
 *               target_id:
 *                 type: integer
 *               target_type:
 *                 type: string
 *                 enum: [Tool, News, Article, Learning, Prompt, Glossary]
 *     responses:
 *       201:
 *         description: Bookmark created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createBookmarkSchema }),
  controller.create.bind(controller)
);

/**
 * @swagger
 * /bookmarks/{id}:
 *   delete:
 *     tags: [Bookmarks]
 *     summary: Remove a bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *     responses:
 *       200:
 *         description: Bookmark removed
 *       401:
 *         description: Unauthorized
 */
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: idParamSchema }),
  controller.remove.bind(controller)
);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get all bookmarks (Admin)
 *     security:
 *       - bearerAuth: []
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
 *         name: target_type
 *         schema:
 *           type: string
 *           enum: [Tool, News, Article, Learning, Prompt, Glossary]
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Bookmarks fetched
 *       403:
 *         description: Forbidden
 */
router.get(
  '/',
  authMiddleware,
  validateRequest({ query: getBookmarksQuerySchema }),
  controller.getAllBookmarks.bind(controller)
);

export default router;
