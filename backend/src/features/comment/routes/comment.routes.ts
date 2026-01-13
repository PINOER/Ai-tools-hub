import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller.ts';
import { CommentService } from '../services/comment.service.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import {
  createCommentSchema,
  updateCommentSchema,
  updateCommentStatusSchema,
  getCommentsSchema,
} from '../validators/comment.validator.ts';
import { authMiddleware } from '../../../middleware/auth.middleware.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();
const commentService = new CommentService(prisma);
const commentController = new CommentController(commentService);

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         content_type:
 *           type: string
 *           enum: [TOOL, NEWS, ARTICLE, LEARNING, PROMPT, GLOSSARY]
 *         content_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, FLAGGED]
 *         user_id:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         user:
 *           $ref: '#/components/schemas/User'
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *
 *     CreateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *         - content_type
 *         - content_id
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *         content_type:
 *           type: string
 *           enum: [TOOL, NEWS, ARTICLE, LEARNING, PROMPT, GLOSSARY]
 *         content_id:
 *           type: integer
 *           minimum: 1
 *
 *     UpdateCommentRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           minLength: 1
 *           maxLength: 1000
 *
 *     UpdateCommentStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, FLAGGED]
 *
 *     GetCommentsQuery:
 *       type: object
 *       required:
 *         - content_type
 *         - content_id
 *       properties:
 *         content_type:
 *           type: string
 *           enum: [TOOL, NEWS, ARTICLE, LEARNING, PROMPT, GLOSSARY]
 *         content_id:
 *           type: integer
 *           minimum: 1
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a new comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentRequest'
 *     responses:
 *       201:
 *         description: Comment created successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 */
// Create comment
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createCommentSchema }),
  commentController.createComment.bind(commentController)
);

/**
 * @swagger
 * /comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments for specific content
 *     parameters:
 *       - in: query
 *         name: content_type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [TOOL, NEWS, ARTICLE, LEARNING, PROMPT, GLOSSARY]
 *         description: Type of content to get comments for (optional)
 *       - in: query
 *         name: content_id
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID of the content (optional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of comments per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, FLAGGED]
 *           default: APPROVED
 *         description: Filter comments by status (defaults to APPROVED)
 *       - in: query
 *         name: user_id
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter comments by specific user ID (optional)
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
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
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     total:
 *                       type: integer
 *       400:
 *         description: Validation error or bad request
 */
// Get comments for specific content
router.get(
  '/',
  authMiddleware,
  validateRequest({ query: getCommentsSchema }),
  commentController.getComments.bind(commentController)
);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     tags: [Comments]
 *     summary: Get a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 */
// Get comment by ID
router.get('/:id', authMiddleware, commentController.getCommentById.bind(commentController));

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     tags: [Comments]
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentRequest'
 *     responses:
 *       200:
 *         description: Comment updated successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
// Update comment
router.put(
  '/:id',
  authMiddleware,
  validateRequest({ body: updateCommentSchema }),
  commentController.updateComment.bind(commentController)
);

/**
 * @swagger
 * /comments/{id}/status:
 *   patch:
 *     tags: [Comments]
 *     summary: Update comment status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentStatusRequest'
 *     responses:
 *       200:
 *         description: Comment status updated successfully
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
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Validation error or bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
// Update comment status (admin only)
router.patch(
  '/:id/status',
  authMiddleware,
  validateRequest({ body: updateCommentStatusSchema }),
  commentController.updateCommentStatus.bind(commentController)
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   type: null
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */
// Delete comment
router.delete('/:id', authMiddleware, commentController.deleteComment.bind(commentController));

export default router;
