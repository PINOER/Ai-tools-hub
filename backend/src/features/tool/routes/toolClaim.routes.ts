import { Router } from 'express';
import { ToolClaimController } from '../controllers/toolClaim.controller.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { RoleType } from '@prisma/client';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import {
  createToolClaimSchema,
  toolIdParamSchema,
  toolClaimStatusQuerySchema,
  updateToolClaimReviewSchema,
  updateToolClaimSchema,
  bulkToolClaimReviewSchema,
  bulkDeleteToolClaimsSchema,
} from '../validators/toolClaim.validator.ts';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { ToolClaimService } from '../services/toolClaim.service.ts';
import { existsMiddleware } from '../../../middleware/existence.middleware.ts';

const toolClaimService = new ToolClaimService();
const controller = new ToolClaimController(toolClaimService);

const router = Router();

/**
 * @swagger
 * /tool-claims/bulk-delete:
 *   post:
 *     tags: [Tool Claims]
 *     summary: Bulk delete tool claims
 *     description: Delete multiple tool claims at once (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - claim_ids
 *             properties:
 *               claim_ids:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 50
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                   description: Tool claim ID to delete
 *           example:
 *             claim_ids: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Bulk delete completed successfully
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
 *                       description: Number of claims deleted
 *                     deletedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       description: Array of deleted claim IDs
 *       400:
 *         description: Validation error or claims not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  '/bulk-delete',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkDeleteToolClaimsSchema }),
  controller.bulkDelete.bind(controller)
);

/**
 * @swagger
 * /tool-claims/{tool_id}:
 *   post:
 *     tags: [Tool Claims]
 *     summary: Submit a tool claim
 *     description: Submit a claim for ownership of a tool
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tool_id
 *         required: true
 *         description: Tool ID to claim
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - job
 *               - company_email
 *               - phone
 *               - relationship
 *               - company_website
 *               - company_image
 *               - professional_profile
 *               - additional_information
 *             properties:
 *               full_name:
 *                 type: string
 *                 minLength: 1
 *                 description: Full name of the claimant
 *               job:
 *                 type: string
 *                 minLength: 1
 *                 description: Job title of the claimant
 *               company_email:
 *                 type: string
 *                 format: email
 *                 description: Company email address
 *               phone:
 *                 type: string
 *                 minLength: 5
 *                 description: Phone number
 *               relationship:
 *                 type: string
 *                 enum: [Creator, CEO, MarketingManager]
 *                 description: Relationship to the tool/company
 *               company_website:
 *                 type: string
 *                 format: uri
 *                 description: Company website URL
 *               tool_website:
 *                 type: string
 *                 format: uri
 *                 description: Tool website URL (optional)
 *               company_image:
 *                 type: string
 *                 minLength: 1
 *                 description: Company identification card or document
 *               professional_profile:
 *                 type: string
 *                 minLength: 1
 *                 description: Professional profile information
 *               additional_information:
 *                 type: string
 *                 minLength: 1
 *                 description: Additional supporting information
 *     responses:
 *       201:
 *         description: Tool claim submitted successfully
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
 *       400:
 *         description: Validation error or duplicate claim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Tool not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/:tool_id',
  authMiddleware,
  validateRequest({ body: createToolClaimSchema, params: toolIdParamSchema }),
  existsMiddleware.toolExists,
  controller.submitClaim.bind(controller)
);

/**
 * @swagger
 * /tool-claims/status/bulk-update:
 *   patch:
 *     tags: [Tool Claims]
 *     summary: Bulk review tool claims
 *     description: Review multiple tool claims at once - approve, reject, or update status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - claims
 *             properties:
 *               claims:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - status
 *                   properties:
 *                     id:
 *                       type: integer
 *                       minimum: 1
 *                       description: Tool claim ID
 *                     status:
 *                       type: string
 *                       enum: [Pending, Approved, Rejected]
 *                       description: New status for the claim
 *                     review_notes:
 *                       type: string
 *                       maxLength: 1000
 *                       description: Admin notes for the review decision
 *           example:
 *             claims:
 *               - id: 1
 *                 status: "Approved"
 *                 review_notes: "Verified company and legitimacy"
 *               - id: 2
 *                 status: "Rejected"
 *                 review_notes: "Insufficient verification documents"
 *     responses:
 *       200:
 *         description: Bulk review completed successfully
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
 *                       description: Successfully processed claims
 *                     errors:
 *                       type: array
 *                       description: Claims that failed to process
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           error:
 *                             type: string
 *                     processed:
 *                       type: integer
 *                       description: Number of successfully processed claims
 *                     failed:
 *                       type: integer
 *                       description: Number of failed claims
 *       400:
 *         description: Validation error
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
  validateRequest({ body: bulkToolClaimReviewSchema }),
  controller.bulkApprove.bind(controller)
);

/**
 * @swagger
 * /tool-claims/{id}:
 *   patch:
 *     tags: [Tool Claims]
 *     summary: Update a tool claim
 *     description: Update an existing tool claim (only by the claimant)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tool claim ID to update
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
 *               full_name:
 *                 type: string
 *                 minLength: 1
 *                 description: Full name of the claimant
 *               job:
 *                 type: string
 *                 minLength: 1
 *                 description: Job title of the claimant
 *               company_email:
 *                 type: string
 *                 format: email
 *                 description: Company email address
 *               phone:
 *                 type: string
 *                 minLength: 5
 *                 description: Phone number
 *               relationship:
 *                 type: string
 *                 enum: [Creator, CEO, MarketingManager]
 *                 description: Relationship to the tool/company
 *               company_website:
 *                 type: string
 *                 format: uri
 *                 description: Company website URL
 *               tool_website:
 *                 type: string
 *                 format: uri
 *                 description: Tool website URL (optional)
 *               company_image:
 *                 type: string
 *                 minLength: 1
 *                 description: Company identification card or document
 *               professional_profile:
 *                 type: string
 *                 minLength: 1
 *                 description: Professional profile information
 *               additional_information:
 *                 type: string
 *                 minLength: 1
 *                 description: Additional supporting information
 *     responses:
 *       200:
 *         description: Tool claim updated successfully
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not allowed to update this claim
 *       404:
 *         description: Tool claim not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authMiddleware,
  validateRequest({ body: updateToolClaimSchema, params: idParamSchema }),
  controller.updateClaim.bind(controller)
);

/**
 * @swagger
 * /tool-claims:
 *   get:
 *     tags: [Tool Claims]
 *     summary: Get all tool claims
 *     description: Retrieve all tool claims (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter by claim status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Tool claims retrieved successfully
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
 *                     claims:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           tool_id:
 *                             type: integer
 *                           user_id:
 *                             type: integer
 *                           full_name:
 *                             type: string
 *                           job:
 *                             type: string
 *                           company_email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           relationship:
 *                             type: string
 *                           company_website:
 *                             type: string
 *                           tool_website:
 *                             type: string
 *                           company_image:
 *                             type: string
 *                           professional_profile:
 *                             type: string
 *                           additional_information:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [Pending, Approved, Rejected]
 *                           review_notes:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                         total_pages:
 *                           type: integer
 *                         total_items:
 *                           type: integer
 *                         items_per_page:
 *                           type: integer
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authMiddleware,
  validateRequest({ query: toolClaimStatusQuerySchema }),
  controller.getClaims.bind(controller)
);

/**
 * @swagger
 * /tool-claims/{id}/approve:
 *   patch:
 *     tags: [Tool Claims]
 *     summary: Review a tool claim
 *     description: Approve, reject, or update the review status of a tool claim (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tool claim ID to review
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
 *               status:
 *                 type: string
 *                 enum: [Pending, Approved, Rejected]
 *                 description: Updated status of the claim
 *               review_notes:
 *                 type: string
 *                 maxLength: 1000
 *                 description: Admin notes for the review decision
 *     responses:
 *       200:
 *         description: Tool claim review updated successfully
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Tool claim not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id/approve',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({
    params: idParamSchema,
    body: updateToolClaimReviewSchema,
  }),
  controller.approveReview.bind(controller)
);

/**
 * @swagger
 * /tool-claims/{id}:
 *   delete:
 *     tags: [Tool Claims]
 *     summary: Delete a tool claim
 *     description: Delete a tool claim (only by the claimant or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Tool claim ID to delete
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Tool claim deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Not allowed to delete this claim
 *       404:
 *         description: Tool claim not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: idParamSchema }),
  controller.deleteClaim.bind(controller)
);

export default router;
