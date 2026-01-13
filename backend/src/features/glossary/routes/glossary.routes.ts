import { Router } from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
  roleMiddleware,
} from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';
import { GlossaryService } from '../services/glossary.service.ts';
import {
  createGlossaryTermSchema,
  updateGlossaryTermSchema,
  createGlossaryRelationSchema,
  getGlossaryTermsQuerySchema,
  createGlossaryEditSubmissionSchema,
  bulkUpdateStatusSchema,
  glossaryIdParamSchema,
} from '../validators/glossary.validator.ts';
import { GlossaryController } from '../controllers/glossary.controller.ts';
import { RoleType, Section } from '@prisma/client';
import { categoriesExist, existsMiddleware } from '@middleware/existence.middleware.ts';
import { prisma } from '../../../config/index.ts';

const router = Router();
const glossaryService = new GlossaryService(prisma);
const glossaryController = new GlossaryController(glossaryService);

/**
 * @swagger
 * tags:
 *   name: Glossary
 *   description: Glossary terms and AI glossary management
 */

/**
 * @swagger
 * /glossary:
 *   post:
 *     tags: [Glossary]
 *     summary: Create a new glossary term
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - term
 *               - definition
 *               - category_id
 *               - status
 *             properties:
 *               term:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               definition:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *               seo_meta_title:
 *                 type: string
 *                 maxLength: 60
 *               seo_meta_description:
 *                 type: string
 *                 maxLength: 160
 *               related_terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs of related glossary terms
 *               status:
 *                 type: string
 *                 enum: [Draft, Published, Scheduled]
 *                 default: Draft
 *     responses:
 *       201:
 *         description: Glossary term created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createGlossaryTermSchema }),
  categoriesExist(Section.Glossary),
  glossaryController.createTerm.bind(glossaryController)
);

/**
 * @swagger
 * /glossary/terms:
 *   get:
 *     tags: [Glossary]
 *     summary: Get all glossary terms
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search terms by keyword
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Draft, Published, Scheduled]
 *         description: Filter by status
 *       - in: query
 *         name: moderation_status
 *         schema:
 *           type: string
 *           enum: [Pending, Approved, Rejected]
 *         description: Filter by moderation status
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [MANUAL, AI]
 *         description: Filter by source
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order by creation date
 *     responses:
 *       200:
 *         description: List of glossary terms with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 terms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       term:
 *                         type: string
 *                       definition:
 *                         type: string
 *                       status:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           username:
 *                             type: string
 *                           first_name:
 *                             type: string
 *                           last_name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           avatar:
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
 */
router.get(
  '/terms',
  validateRequest({ query: getGlossaryTermsQuerySchema }),
  optionalAuthMiddleware,
  glossaryController.getAllTerms.bind(glossaryController)
);

/**
 * @swagger
 * /glossary/terms/{id}:
 *   get:
 *     tags: [Glossary]
 *     summary: Get a glossary term by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Glossary term ID
 *     responses:
 *       200:
 *         description: Glossary term found
 *       404:
 *         description: Term not found
 */
router.get(
  '/terms/:id',
  validateRequest({ params: glossaryIdParamSchema }),
  glossaryController.getTerm.bind(glossaryController)
);

/**
 * @swagger
 * /glossary/terms/{id}:
 *   put:
 *     tags: [Glossary]
 *     summary: Update a glossary term
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Glossary term ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               term:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               definition:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               category_id:
 *                 type: integer
 *                 minimum: 1
 *               seo_meta_title:
 *                 type: string
 *                 maxLength: 60
 *               seo_meta_description:
 *                 type: string
 *                 maxLength: 160
 *               related_terms:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Glossary term updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Term not found
 */
router.put(
  '/terms/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: glossaryIdParamSchema, body: updateGlossaryTermSchema }),
  existsMiddleware.glossaryTermExists,
  categoriesExist(Section.Glossary),
  glossaryController.updateTerm.bind(glossaryController)
);

/**
 * @swagger
 * /glossary/terms/{id}:
 *   delete:
 *     tags: [Glossary]
 *     summary: Delete a glossary term
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Glossary term ID
 *     responses:
 *       200:
 *         description: Glossary term deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Term not found
 */
router.delete(
  '/terms/:id',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ params: glossaryIdParamSchema }),
  existsMiddleware.glossaryTermExists,
  glossaryController.deleteTerm.bind(glossaryController)
);

/**
 * @swagger
 * /glossary/relations:
 *   post:
 *     tags: [Glossary]
 *     summary: Create a relation between glossary terms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - term_id
 *               - related_term_id
 *               - relation_type
 *             properties:
 *               term_id:
 *                 type: integer
 *                 minimum: 1
 *               related_term_id:
 *                 type: integer
 *                 minimum: 1
 *               relation_type:
 *                 type: string
 *                 enum: [similar, opposite, broader, narrower]
 *     responses:
 *       201:
 *         description: Relation created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post(
  '/relations',
  authMiddleware,
  validateRequest({ body: createGlossaryRelationSchema }),
  glossaryController.createRelation.bind(glossaryController)
);

// Create edit suggestion (user must be logged in)
router.post(
  '/edits',
  authMiddleware,
  validateRequest({ body: createGlossaryEditSubmissionSchema }),
  existsMiddleware.glossaryTermExists,
  glossaryController.createEditSubmission.bind(glossaryController)
);

router.get(
  '/edits',
  authMiddleware,
  glossaryController.getAllEditSubmissions.bind(glossaryController)
);

router.post(
  '/edits/bulk-update-status',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkUpdateStatusSchema }),
  glossaryController.bulkUpdateEditStatus.bind(glossaryController)
);

// Bulk update status for terms (admin only)
router.post(
  '/terms/bulk-update-status',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: bulkUpdateStatusSchema }),
  glossaryController.bulkUpdateTermStatus.bind(glossaryController)
);

export default router;
