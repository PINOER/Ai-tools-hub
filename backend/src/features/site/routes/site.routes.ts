import { Router } from 'express';
import { SiteController } from '../controllers/site.controller.ts';
import { SiteService } from '../services/site.service.ts';
import { RoleType } from '@prisma/client';
import { updateSiteInformationSchema } from '../validators/site.validator.ts';
import { authMiddleware, roleMiddleware } from '../../../middleware/auth.middleware.ts';
import { validateRequest } from '../../../middleware/validation.middleware.ts';

const router = Router();
const siteService = new SiteService();
const siteController = new SiteController(siteService);

/**
 * @swagger
 * /site/information:
 *   patch:
 *     summary: Update site information
 *     tags: [Site]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               site_description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               site_tagline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               status:
 *                 type: string
 *                 enum: [Live, Maintenance]
 *               maintenance_message:
 *                 type: string
 *                 maxLength: 1000
 *               favicon:
 *                 type: string
 *                 format: uri
 *               social_preview:
 *                 type: string
 *                 format: uri
 *               meta_title:
 *                 type: string
 *                 maxLength: 60
 *               meta_description:
 *                 type: string
 *                 maxLength: 160
 *               sitemap_settings:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Tools, Users, Articles, Learning, News]
 *               google_search_console_verification:
 *                 type: string
 *               bing_webmaster_tools_verification:
 *                 type: string
 *               twitter_url:
 *                 type: string
 *                 format: uri
 *               github_url:
 *                 type: string
 *                 format: uri
 *               linkedin_url:
 *                 type: string
 *                 format: uri
 *               youtube_url:
 *                 type: string
 *                 format: uri
 *               google_analytics_id:
 *                 type: string
 *               google_tag_manager_id:
 *                 type: string
 *               facebook_pixel_id:
 *                 type: string
 *               review_status:
 *                 type: boolean
 *               review_approval:
 *                 type: string
 *                 enum: [AutoPublish, AdminApproval]
 *               min_review_length:
 *                 type: integer
 *                 minimum: 1
 *               max_review_length:
 *                 type: integer
 *                 minimum: 10
 *               tool_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               article_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               learning_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               admin_notification_email:
 *                 type: string
 *                 format: email
 *               notify_admins_for:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ToolSubmission, ArticleSubmission, LearningSubmission, FlaggedContentReport, NewUserRegistration]
 *               email_service_provider:
 *                 type: string
 *                 enum: [SMTP, SendGrid, Mailgun, AmazonSES]
 *               smtp_host:
 *                 type: string
 *               smtp_port:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 65535
 *               smtp_username:
 *                 type: string
 *               smtp_password:
 *                 type: string
 *               from_email:
 *                 type: string
 *                 format: email
 *               from_name:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Site information updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/information',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: updateSiteInformationSchema }),
  siteController.updateSiteInformation.bind(siteController)
);

/**
 * @swagger
 * /site/information/upsert:
 *   patch:
 *     summary: Create or update site information (upsert)
 *     tags: [Site]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               site_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               site_description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *               site_tagline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *               status:
 *                 type: string
 *                 enum: [Live, Maintenance]
 *               maintenance_message:
 *                 type: string
 *                 maxLength: 1000
 *               favicon:
 *                 type: string
 *                 format: uri
 *               social_preview:
 *                 type: string
 *                 format: uri
 *               meta_title:
 *                 type: string
 *                 maxLength: 60
 *               meta_description:
 *                 type: string
 *                 maxLength: 160
 *               sitemap_settings:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Tools, Users, Articles, Learning, News]
 *               google_search_console_verification:
 *                 type: string
 *               bing_webmaster_tools_verification:
 *                 type: string
 *               twitter_url:
 *                 type: string
 *                 format: uri
 *               github_url:
 *                 type: string
 *                 format: uri
 *               linkedin_url:
 *                 type: string
 *                 format: uri
 *               youtube_url:
 *                 type: string
 *                 format: uri
 *               google_analytics_id:
 *                 type: string
 *               google_tag_manager_id:
 *                 type: string
 *               facebook_pixel_id:
 *                 type: string
 *               review_status:
 *                 type: boolean
 *               review_approval:
 *                 type: string
 *                 enum: [AutoPublish, AdminApproval]
 *               min_review_length:
 *                 type: integer
 *                 minimum: 1
 *               max_review_length:
 *                 type: integer
 *                 minimum: 10
 *               tool_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               article_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               learning_submission_approval:
 *                 type: string
 *                 enum: [AutoApprove, AdminApproval]
 *               admin_notification_email:
 *                 type: string
 *                 format: email
 *               notify_admins_for:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [ToolSubmission, ArticleSubmission, LearningSubmission, FlaggedContentReport, NewUserRegistration]
 *               email_service_provider:
 *                 type: string
 *                 enum: [SMTP, SendGrid, Mailgun, AmazonSES]
 *               smtp_host:
 *                 type: string
 *               smtp_port:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 65535
 *               smtp_username:
 *                 type: string
 *               smtp_password:
 *                 type: string
 *               from_email:
 *                 type: string
 *                 format: email
 *               from_name:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Site information created or updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/information/upsert',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  validateRequest({ body: updateSiteInformationSchema }),
  siteController.upsertSiteInformation.bind(siteController)
);

/**
 * @swagger
 * /site/settings:
 *   get:
 *     summary: Get site settings
 *     tags: [Site]
 *     responses:
 *       200:
 *         description: Site settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     site_status:
 *                       type: string
 *                       enum: [Live, Maintenance]
 *                     review_status:
 *                       type: boolean
 *                     review_approval:
 *                       type: string
 *                       enum: [AutoPublish, AdminApproval]
 *                     tool_submission_approval:
 *                       type: string
 *                       enum: [AutoApprove, AdminApproval]
 *                     article_submission_approval:
 *                       type: string
 *                       enum: [AutoApprove, AdminApproval]
 *                     learning_submission_approval:
 *                       type: string
 *                       enum: [AutoApprove, AdminApproval]
 *                     min_review_length:
 *                       type: integer
 *                     max_review_length:
 *                       type: integer
 */
router.get(
  '/settings',
  authMiddleware,
  roleMiddleware([RoleType.Admin]),
  siteController.getSiteSettings.bind(siteController)
);

export default router;
