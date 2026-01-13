import { Router } from 'express';
import { RelatednessController } from '../controllers/relatedness.controller.ts';
import { relatednessParamSchema } from '../validators/relatedness.validator.ts';
import { validateRequest } from '@middleware/validation.middleware.ts';

const router = Router();
const controller = new RelatednessController();

/**
 * @swagger
 * /related/{entity}/{id}:
 *   get:
 *     summary: Get related content for a specific entity
 *     description: Retrieves related content based on tags and NLP similarity for the specified entity
 *     tags: [Relatedness]
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Tool, News, Article, Learning, Prompt, GlossaryTerm]
 *         description: The type of entity to find related content for
 *         example: Tool
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The ID of the entity
 *         example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved related content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tools:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "AI Tool Name"
 *                       description:
 *                         type: string
 *                         example: "Tool description"
 *                 news:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "News Title"
 *                       content:
 *                         type: string
 *                         example: "News content"
 *                 articles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Article Title"
 *                       content:
 *                         type: string
 *                         example: "Article content"
 *                 learnings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Learning Title"
 *                       content:
 *                         type: string
 *                         example: "Learning content"
 *                 prompts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Prompt Title"
 *                       content:
 *                         type: string
 *                         example: "Prompt content"
 *                 glossaries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       term:
 *                         type: string
 *                         example: "Glossary Term"
 *                       definition:
 *                         type: string
 *                         example: "Term definition"
 *       400:
 *         description: Bad request - Invalid entity type or ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid entity type"
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Entity not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
  '/:entity/:id',
  validateRequest({ params: relatednessParamSchema }),
  controller.getRelatedContent.bind(controller)
);

export default router;
