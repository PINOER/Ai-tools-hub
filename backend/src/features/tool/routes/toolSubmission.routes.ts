import { Router } from 'express';
import { ToolSubmissionController } from '../controllers/toolSubmission.controller.ts';
import { ToolSubmissionService } from '../services/toolSubmission.service.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { prisma } from '../../../config/index.ts';

import {
  createToolSubmissionSchema,
  updateToolSubmissionStatusSchema,
  getToolSubmissionsQuerySchema,
  bulkToolSubmissionReviewSchema,
} from '../validators/toolSubmission.validator.ts';

import { RoleType } from '@prisma/client';
import { idParamSchema } from '../../../validators/shared.validator.ts';
import { existsMiddleware } from '../../../middleware/existence.middleware.ts';
import { z } from 'zod';

const router = Router();
const controller = new ToolSubmissionController(new ToolSubmissionService(prisma));

/**
 * @swagger
 * tags:
 *   name: ToolSubmissions
 *   description: Tool submission management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClaimStatusEnum:
 *       type: string
 *       enum: [Pending, Approved, Rejected]
 */

/**
 * @swagger
 * /tool-submissions:
 *   post:
 *     tags: [ToolSubmissions]
 *     summary: Submit a tool for approval
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tool_id
 *             properties:
 *               tool_id:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID of the tool to submit
 *           example:
 *             tool_id: 5
 *     responses:
 *       201:
 *         description: Submission created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createToolSubmissionSchema }),
  existsMiddleware.toolExists,
  controller.createToolSubmission.bind(controller)
);

/**
 * @swagger
 * /tool-submissions:
 *   get:
 *     tags: [ToolSubmissions]
 *     summary: Get all tool submissions with filtering and pagination (Admin only)
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
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter submissions by status
 *       - in: query
 *         name: tool_id
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Filter submissions by specific tool ID
 *     responses:
 *       200:
 *         description: List of submissions with pagination info
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
 *                       tool_id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       status:
 *                         $ref: '#/components/schemas/ClaimStatusEnum'
 *                       internal_notes:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       tool:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           website_url:
 *                             type: string
 *                           status:
 *                             type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           email:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
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
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ query: getToolSubmissionsQuerySchema }),
  controller.getAllSubmissions.bind(controller)
);

/**
 * @swagger
 * /tool-submissions/status/bulk-update:
 *   patch:
 *     tags: [ToolSubmissions]
 *     summary: Bulk review tool submissions
 *     description: Review multiple tool submissions at once - approve, reject, or update status (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submissions
 *             properties:
 *               submissions:
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
 *                       description: Tool submission ID
 *                     status:
 *                       type: string
 *                       enum: [Pending, Approved, Rejected]
 *                       description: New status for the submission
 *                     internal_notes:
 *                       type: string
 *                       maxLength: 1000
 *                       description: Optional internal notes for the review decision
 *           example:
 *             submissions:
 *               - id: 1
 *                 status: "Approved"
 *                 internal_notes: "Tool meets all requirements and is ready for publication"
 *               - id: 2
 *                 status: "Rejected"
 *                 internal_notes: "Missing required information in tool description"
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
 *                       description: Successfully processed submissions
 *                     processed:
 *                       type: integer
 *                       description: Number of successfully processed submissions
 *                     failed:
 *                       type: integer
 *                       description: Number of failed submissions
 *                     errors:
 *                       type: array
 *                       description: Array of errors (empty if all successful)
 *       400:
 *         description: Validation error or invalid submission IDs
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
  validateRequest({ body: bulkToolSubmissionReviewSchema }),
  controller.bulkApproveSubmissions.bind(controller)
);

/**
 * @swagger
 * /tool-submissions/{id}:
 *   get:
 *     tags: [ToolSubmissions]
 *     summary: Get a single tool submission (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Tool submission ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Submission data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Tool submission not found
 */
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  controller.getToolSubmission.bind(controller)
);

/**
 * @swagger
 * /tool-submissions/{id}:
 *   patch:
 *     tags: [ToolSubmissions]
 *     summary: Update tool submission status (Admin only)
 *     description: Update the status of a tool submission with optional internal notes. Status is mandatory.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool submission ID
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
 *                 $ref: '#/components/schemas/ClaimStatusEnum'
 *                 description: New status for the submission (required)
 *               internal_notes:
 *                 type: string
 *                 description: Optional internal notes about the status change
 *           examples:
 *             approve:
 *               summary: Approve submission
 *               value:
 *                 status: "Approved"
 *                 internal_notes: "Tool meets all requirements and is ready for publication"
 *             reject:
 *               summary: Reject submission
 *               value:
 *                 status: "Rejected"
 *                 internal_notes: "Missing required information in tool description"
 *             pending:
 *               summary: Set to pending
 *               value:
 *                 status: "Pending"
 *                 internal_notes: "Requires additional review from technical team"
 *     responses:
 *       200:
 *         description: Submission status updated successfully
 *       400:
 *         description: Validation error - status is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Tool submission not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({
    params: idParamSchema,
    body: updateToolSubmissionStatusSchema,
  }),
  controller.updateToolSubmissionStatus.bind(controller)
);

/**
 * @swagger
 * /tool-submissions/{id}:
 *   delete:
 *     tags: [ToolSubmissions]
 *     summary: Delete a tool submission (Admin only)
 *     description: Delete a single tool submission. This only deletes the submission, not the associated tool.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: ^\d+$
 *         description: Tool submission ID
 *     responses:
 *       200:
 *         description: Tool submission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Tool submission not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: idParamSchema }),
  controller.deleteToolSubmission.bind(controller)
);

/**
 * @swagger
 * /tool-submissions/bulk-delete:
 *   post:
 *     tags: [ToolSubmissions]
 *     summary: Bulk delete tool submissions (Admin only)
 *     description: Delete multiple tool submissions at once. This only deletes the submissions, not the associated tools.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submission_ids
 *             properties:
 *               submission_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 1
 *                 minItems: 1
 *                 maxItems: 50
 *                 description: Array of tool submission IDs to delete (1-50 submissions)
 *           example:
 *             submission_ids: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Tool submissions deleted successfully
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
 *                       description: Number of submissions deleted
 *                     deletedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       description: Array of deleted submission IDs
 *       400:
 *         description: Validation error or some submissions not found
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
  validateRequest({
    body: z.object({ submission_ids: z.array(z.number().int().positive()).min(1).max(50) }),
  }),
  controller.bulkDeleteSubmissions.bind(controller)
);

export default router;
