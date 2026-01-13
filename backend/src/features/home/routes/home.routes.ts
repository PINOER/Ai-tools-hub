import { Router } from 'express';
import { validateRequest } from '@middleware/validation.middleware.ts';
import { getHomeDataSchema } from '../validators/home.validator.ts';
import { HomeController } from '../controllers/home.controller.ts';
import { HomeService } from '../services/home.service.ts';
import { authMiddleware, roleMiddleware } from '@middleware/auth.middleware.ts';
import { RoleType } from '@prisma/client';

const router = Router();

const homeService = new HomeService();
const homeController = new HomeController(homeService);

/**
 * @swagger
 * /home:
 *   get:
 *     tags: [Home]
 *     summary: Get home page data
 *     parameters:
 *       - in: query
 *         name: resources
 *         schema:
 *           type: string
 *         description: Comma-separated list of resources to fetch (News,Article,Glossary,Tool,Learning)
 *         example: "News,Article,Tool"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of items to fetch per resource type
 *         example: 10
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order for results
 *         example: "desc"
 *       - in: query
 *         name: is_featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured items only
 *         example: true
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *         example: 1
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query to filter results by name/title/content
 *         example: "AI"
 *     responses:
 *       200:
 *         description: Home data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     news:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           headline:
 *                             type: string
 *                           content:
 *                             type: string
 *                           is_featured:
 *                             type: boolean
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
 *                               avatar:
 *                                 type: string
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                     tools:
 *                       type: array
 *                       items:
 *                         type: object
 *                     glossary:
 *                       type: array
 *                       items:
 *                         type: object
 *                     learning:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  validateRequest({ query: getHomeDataSchema }),
  homeController.getHomeData.bind(homeController)
);

/**
 * @swagger
 * /home/pending-approvals:
 *   get:
 *     tags: [Home]
 *     summary: Get pending approvals count for admin dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending approvals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     toolSubmissions:
 *                       type: integer
 *                       description: Number of pending tool submissions
 *                       example: 5
 *                     toolClaims:
 *                       type: integer
 *                       description: Number of pending tool claims
 *                       example: 2
 *                     articleReviews:
 *                       type: integer
 *                       description: Number of pending article reviews
 *                       example: 3
 *                     glossaryReviews:
 *                       type: integer
 *                       description: Number of pending glossary reviews
 *                       example: 1
 *                     promptReviews:
 *                       type: integer
 *                       description: Number of pending prompt reviews
 *                       example: 4
 *                     learningReviews:
 *                       type: integer
 *                       description: Number of pending learning reviews
 *                       example: 2
 *                     reviewModerations:
 *                       type: integer
 *                       description: Number of reviews needing moderation (reported/flagged)
 *                       example: 1
 *                     total:
 *                       type: integer
 *                       description: Total number of pending approvals
 *                       example: 18
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/pending-approvals',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  homeController.getPendingApprovals.bind(homeController)
);

/**
 * @swagger
 * /home/dashboard-stats:
 *   get:
 *     tags: [Home]
 *     summary: Get dashboard statistics with growth percentages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeUsers:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Total number of active users
 *                       example: 2847
 *                     growth:
 *                       type: integer
 *                       description: Growth percentage from last month
 *                       example: 12
 *                 totalTools:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Total number of approved tools
 *                       example: 1234
 *                     growth:
 *                       type: integer
 *                       description: Growth percentage from last month
 *                       example: 8
 *                 totalCategories:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Total number of categories
 *                       example: 45
 *                     growth:
 *                       type: integer
 *                       description: Growth percentage from last month
 *                       example: 3
 *                 reviews:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       description: Total number of reviews
 *                       example: 892
 *                     growth:
 *                       type: integer
 *                       description: Growth percentage from last month
 *                       example: 15
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/dashboard-stats',
  authMiddleware,
  roleMiddleware([RoleType.Admin, RoleType.Moderator]),
  homeController.getDashboardStats.bind(homeController)
);

export default router;
