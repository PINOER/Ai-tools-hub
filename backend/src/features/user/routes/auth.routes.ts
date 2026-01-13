import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.ts';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  logoutSchema,
  socialLoginSchema,
} from '../validators/auth.validator.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - role
 *               - status
 *               - avatar
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [Admin, Moderator, User, Contributor]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, Banned]
 *                 default: Active
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: User avatar URL (required)

 *               bio:
 *                 type: string
 *                 nullable: true
 *               moderation_notes:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  authController.register.bind(authController)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     role:
 *                       type: string
 *                 status:
 *                   type: string
 *                   enum: [Active, Inactive, Banned, Suspended, Deleted]
 *                 avatar:
 *                   type: string
 *                   nullable: true
 *                 toolsSubmitted:
 *                   type: integer
 *                   description: Number of tools submitted by user
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       overall_rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       status:
 *                         type: string
 *                       tool:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                 comments:
 *                   type: integer
 *                   description: Number of comments by user
 *                 activityHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                 bio:
 *                   type: string
 *                 password:
 *                   type: string
 *                   description: Empty string for security
 *                 repeatPassword:
 *                   type: string
 *                   description: Empty string for security
 *                 moderation_notes:
 *                   type: string
 *                   nullable: true
 *                 sendWelcomeEmail:
 *                   type: boolean
 *       400:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  authController.login.bind(authController)
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       400:
 *         description: Invalid refresh token
 */
router.post(
  '/refresh',
  validateRequest({ body: refreshTokenSchema }),
  authController.refresh.bind(authController)
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Logout a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged out
 */
router.post(
  '/logout',
  validateRequest({ body: logoutSchema }),
  authController.logout.bind(authController)
);

/**
 * @swagger
 * /auth/social-login:
 *   post:
 *     tags: [Authentication]
 *     summary: Social login - authenticate with multiple providers
 *     description: |
 *       This endpoint handles social login authentication for multiple providers (GitHub, Facebook, Google).
 *       It accepts user data from the frontend and either logs in an existing user or creates a new account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - provider
 *               - providerId
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *                 description: User's first name
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               provider:
 *                 type: string
 *                 enum: [Email, Github, Facebook, Gmail]
 *                 description: Social login provider (Email for email/password users)
 *               providerId:
 *                 type: string
 *                 minLength: 1
 *                 description: Provider user ID
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 description: User's avatar URL
 *     responses:
 *       200:
 *         description: User authenticated successfully (new user created or existing user logged in)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 role:
 *                   type: object
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 toolsSubmitted:
 *                   type: integer
 *                 reviews:
 *                   type: array
 *                 comments:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Invalid request data or missing user data
 *       422:
 *         description: Validation error
 */
router.post(
  '/social-login',
  validateRequest({ body: socialLoginSchema }),
  authController.socialLogin.bind(authController)
);

export default router;
