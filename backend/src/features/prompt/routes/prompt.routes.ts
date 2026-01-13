import { Router } from 'express';
import { PromptController } from '../controllers/prompt.controller.ts';
import { PromptService } from '../services/prompt.service.ts';
import {
  authMiddleware,
  optionalAuthMiddleware,
  roleMiddleware,
} from '@middleware/auth.middleware.ts';
import { validateRequest } from '@middleware/validation.middleware.ts';
import {
  createPromptSchema,
  updatePromptSchema,
  getPromptsQuerySchema,
  promptIdParamSchema,
  createPromptChainSchema,
  updatePromptChainSchema,
  promptChainIdParamSchema,
  bulkUpdatePromptStatusSchema,
  bulkDeletePromptsSchema,
} from '../validators/prompt.validator.ts';
import { RoleType, Section } from '@prisma/client';
import { PromptChainService } from '../services/promptChain.service.ts';
import { categoriesExist } from '@middleware/existence.middleware.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();
const controller = new PromptController(new PromptService(prisma), new PromptChainService());

/**
 * @swagger
 * tags:
 *   name: Prompts
 *   description: AI Prompt management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PromptStatusEnum:
 *       type: string
 *       enum: [Draft, Published, Scheduled]
 *     AIModelEnum:
 *       type: string
 *       description: AI model name (e.g., GPT-3, GPT-4, Llama, Claude, etc.)
 *       example: "GPT-4"
 */

/**
 * @swagger
 * /prompts:
 *   post:
 *     tags: [Prompts]
 *     summary: Create a new AI prompt
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
 *               - category_id
 *               - status
 *               - ai_models
 *               - main_prompt
 *               - published_date
 *               - published_time
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Title of the prompt
 *               url_slug:
 *                 type: string
 *                 maxLength: 100
 *                 description: URL-friendly identifier
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
 *                 description: Secondary category IDs (optional, max 2)
 *               status:
 *                 $ref: '#/components/schemas/PromptStatusEnum'
 *                 default: Draft
 *               ai_models:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: AI model name (e.g., GPT-3, GPT-4, Llama, Claude, etc.)
 *                 minItems: 1
 *                 description: AI models this prompt works with
 *               short_description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Brief description of the prompt
 *               main_prompt:
 *                 type: string
 *                 maxLength: 5000
 *                 description: The actual prompt text
 *               user_guide:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Instructions on how to use the prompt
 *               tags:
 *                 type: string
 *                 maxLength: 500
 *                 description: Comma-separated tags
 *               allow_comments:
 *                 type: boolean
 *                 default: true
 *                 description: Whether comments are allowed on this prompt
 *               is_featured:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the prompt is featured
 *               published_date:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date of the prompt
 *               published_time:
 *                 type: string
 *                 format: date-time
 *                 description: Publication time of the prompt
 *           example:
 *             title: "Professional Email Writer"
 *             url_slug: "professional-email-writer"
 *             category_id: 1
 *             secondary_category_ids: [2, 3]
 *             status: "Draft"
 *             ai_models: ["GPT-4", "GPT-3.5"]
 *             main_prompt: "Write a professional email to {recipient} regarding {subject}..."
 *             short_description: "Generate professional emails for business communication"
 *             user_guide: "Replace {recipient} and {subject} with actual values"
 *             tags: "email, business, communication"
 *             allow_comments: true
 *             published_date: "2025-01-15T10:00:00Z"
 *             published_time: "10:00"
 *     responses:
 *       201:
 *         description: Prompt created successfully
 *       400:
 *         description: Validation error or URL slug already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createPromptSchema }),
  categoriesExist(Section.Prompt),
  controller.createPrompt.bind(controller)
);

/**
 * @swagger
 * /prompts:
 *   get:
 *     tags: [Prompts]
 *     summary: Get all prompts with filtering and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *           default: "1"
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *           default: "10"
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/PromptStatusEnum'
 *         description: Filter by prompt status
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Filter by category ID
 *       - in: query
 *         name: ai_model
 *         schema:
 *           type: string
 *           description: Filter by AI model name
 *         description: Filter by AI model
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter by featured status
 *       - in: query
 *         name: moderation_status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter by moderation status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in headline, description, and content

 *     responses:
 *       200:
 *         description: Prompts retrieved successfully
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
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           url_slug:
 *                             type: string
 *                           user_id:
 *                             type: integer
 *                             nullable: true
 *                           status:
 *                             $ref: '#/components/schemas/PromptStatusEnum'
 *                           moderation_status:
 *                             type: string
 *                             enum: [Pending, Approved, Rejected]
 *                           ai_models:
 *                             type: array
 *                             items:
 *                               type: string
 *                               description: AI model name
 *                           short_description:
 *                             type: string
 *                           main_prompt:
 *                             type: string
 *                           user_guide:
 *                             type: string
 *                           is_featured:
 *                             type: boolean
 *                           tags:
 *                             type: string
 *                           moderation_notes:
 *                             type: string
 *                           allow_comments:
 *                             type: boolean
 *                           published_date:
 *                             type: string
 *                             format: date-time
 *                           published_time:
 *                             type: string
 *                             format: date-time
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           category:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               username:
 *                                 type: string
 *                               first_name:
 *                                 type: string
 *                               last_name:
 *                                 type: string
 *                           _count:
 *                             type: object
 *                             properties:
 *                               votes:
 *                                 type: integer
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateRequest({ query: getPromptsQuerySchema }),
  optionalAuthMiddleware,
  controller.getAllPrompts.bind(controller)
);

/**
 * @swagger
 * /prompts/status/bulk-update:
 *   patch:
 *     tags: [Prompts]
 *     summary: Bulk update prompt status (Admin only)
 *     description: Update status of multiple prompts at once
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompts
 *             properties:
 *               prompts:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - moderation_status
 *                   properties:
 *                     id:
 *                       type: integer
 *                       minimum: 1
 *                       description: Prompt ID
 *                     status:
 *                       $ref: '#/components/schemas/PromptStatusEnum'
 *                       description: New status for the prompt
 *           example:
 *             prompts:
 *               - id: 1
 *                 status: "Published"
 *               - id: 2
 *                 status: "Schedule"
 *     responses:
 *       200:
 *         description: Bulk status update completed successfully
 *       400:
 *         description: Validation error or invalid prompt IDs
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/status/bulk-update',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkUpdatePromptStatusSchema }),
  controller.bulkUpdatePromptStatus.bind(controller)
);

/**
 * @swagger
 * /prompts/{id}:
 *   get:
 *     tags: [Prompts]
 *     summary: Get a single prompt by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt ID
 *     responses:
 *       200:
 *         description: Prompt retrieved successfully
 *       404:
 *         description: Prompt not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  validateRequest({ params: promptIdParamSchema }),
  controller.getPrompt.bind(controller)
);

/**
 * @swagger
 * /prompts/{id}:
 *   patch:
 *     tags: [Prompts]
 *     summary: Update a prompt
 *     description: Update an existing prompt (only by the creator or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               url_slug:
 *                 type: string
 *                 maxLength: 100
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *               secondary_category_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 maxItems: 2
 *                 description: Secondary category IDs (optional, max 2)
 *               is_featured:
 *                 type: boolean
 *               status:
 *                 $ref: '#/components/schemas/PromptStatusEnum'
 *               ai_models:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: AI model name
 *               short_description:
 *                 type: string
 *                 maxLength: 500
 *               main_prompt:
 *                 type: string
 *                 maxLength: 5000
 *               user_guide:
 *                 type: string
 *                 maxLength: 2000
 *               tags:
 *                 type: string
 *                 maxLength: 500
 *               moderation_notes:
 *                 type: string
 *                 description: Notes for moderation
 *               allow_comments:
 *                 type: boolean
 *                 description: Whether comments are allowed on this prompt
 *               published_date:
 *                 type: string
 *                 format: date-time
 *                 description: Publication date of the prompt
 *               published_time:
 *                 type: string
 *                 format: date-time
 *                 description: Publication time of the prompt
 *     responses:
 *       200:
 *         description: Prompt updated successfully
 *       400:
 *         description: Validation error or URL slug already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this prompt
 *       404:
 *         description: Prompt not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authMiddleware,
  validateRequest({ params: promptIdParamSchema, body: updatePromptSchema }),
  controller.updatePrompt.bind(controller)
);

/**
 * @swagger
 * /prompts/{id}:
 *   delete:
 *     tags: [Prompts]
 *     summary: Delete a prompt
 *     description: Delete a prompt (only by the creator or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt ID
 *     responses:
 *       200:
 *         description: Prompt deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this prompt
 *       404:
 *         description: Prompt not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: promptIdParamSchema }),
  controller.deletePrompt.bind(controller)
);

/**
 * @swagger
 * /prompts/{prompt_id}/chains:
 *   post:
 *     tags: [Prompt Chains]
 *     summary: Create a prompt chain step
 *     description: Add a new step to a prompt chain
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: prompt_id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - part_number
 *               - step_title
 *               - text
 *             properties:
 *               part_number:
 *                 type: integer
 *                 minimum: 1
 *                 description: Order of this step in the chain
 *               step_title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Title of this step
 *               step_description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description of this step
 *               text:
 *                 type: string
 *                 maxLength: 2000
 *                 description: The prompt text for this step
 *           example:
 *             part_number: 1
 *             step_title: "Initial Setup"
 *             step_description: "Set up the context for the conversation"
 *             text: "You are a helpful assistant. Please help me with..."
 *     responses:
 *       201:
 *         description: Prompt chain step created successfully
 *       400:
 *         description: Validation error or part number already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:prompt_id/chains',
  authMiddleware,
  validateRequest({ params: promptIdParamSchema, body: createPromptChainSchema }),
  controller.createPromptChain.bind(controller)
);

/**
 * @swagger
 * /prompt-chains/{id}:
 *   patch:
 *     tags: [Prompt Chains]
 *     summary: Update a prompt chain step
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt chain step ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part_number:
 *                 type: integer
 *                 minimum: 1
 *               step_title:
 *                 type: string
 *                 maxLength: 200
 *               step_description:
 *                 type: string
 *                 maxLength: 500
 *               text:
 *                 type: string
 *                 maxLength: 2000
 *     responses:
 *       200:
 *         description: Prompt chain step updated successfully
 *       400:
 *         description: Validation error or part number already exists
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt chain step not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/prompt-chains/:id',
  authMiddleware,
  validateRequest({ params: promptChainIdParamSchema, body: updatePromptChainSchema }),
  controller.updatePromptChain.bind(controller)
);

/**
 * @swagger
 * /prompt-chains/{id}:
 *   delete:
 *     tags: [Prompt Chains]
 *     summary: Delete a prompt chain step
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Prompt chain step ID
 *     responses:
 *       200:
 *         description: Prompt chain step deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prompt chain step not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/prompt-chains/:id',
  authMiddleware,
  validateRequest({ params: promptChainIdParamSchema }),
  controller.deletePromptChain.bind(controller)
);

/**
 * @swagger
 * /prompts/bulk-delete:
 *   post:
 *     tags: [Prompts]
 *     summary: Bulk delete prompts
 *     description: Delete multiple prompts at once. By default, prompts with relationships (chains, tags, categories, votes) cannot be deleted unless force=true is specified.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promptIds
 *             properties:
 *               promptIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 description: Array of prompt IDs to delete
 *               force:
 *                 type: boolean
 *                 default: false
 *                 description: Force deletion even if prompts have relationships
 *           example:
 *             promptIds: [1, 2, 3]
 *             force: false
 *     responses:
 *       200:
 *         description: Bulk deletion completed
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
 *                     success:
 *                       type: array
 *                       items:
 *                         type: object
 *                     processed:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           error:
 *                             type: string
 *       400:
 *         description: Validation error or prompts have relationships (when force=false)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete some prompts
 *       500:
 *         description: Internal server error
 */
router.post(
  '/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkDeletePromptsSchema }),
  controller.bulkDeletePrompts.bind(controller)
);

export default router;
