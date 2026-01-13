import {
  SiteStatus,
  ReviewApprovalStatus,
  SubmissionApprovalStatus,
  EmailServiceProvider,
  EmailNotificationType,
  SitemapSetting,
} from '@prisma/client';
import z from 'zod';

export const updateSiteInformationSchema = z
  .object({
    site_name: z.string().min(1, 'Site name is required').max(255).optional(),
    site_description: z.string().min(1, 'Site description is required').max(1000).optional(),
    site_tagline: z.string().min(1, 'Site tagline is required').max(255).optional(),
    status: z.nativeEnum(SiteStatus).optional(),
    maintenance_message: z.string().max(1000).optional(),
    favicon: z.string().url('Invalid favicon URL').optional(),
    social_preview: z.string().url('Invalid social preview URL').optional(),
    meta_title: z.string().max(60, 'Meta title should be less than 60 characters').optional(),
    meta_description: z
      .string()
      .max(160, 'Meta description should be less than 160 characters')
      .optional(),
    sitemap_settings: z.array(z.nativeEnum(SitemapSetting)).optional(),
    google_search_console_verification: z.string().optional(),
    bing_webmaster_tools_verification: z.string().optional(),
    twitter_url: z.string().url('Invalid Twitter URL').optional(),
    github_url: z.string().url('Invalid GitHub URL').optional(),
    linkedin_url: z.string().url('Invalid LinkedIn URL').optional(),
    youtube_url: z.string().url('Invalid YouTube URL').optional(),
    google_analytics_id: z.string().optional(),
    google_tag_manager_id: z.string().optional(),
    facebook_pixel_id: z.string().optional(),
    review_status: z.boolean().optional(),
    review_approval: z.nativeEnum(ReviewApprovalStatus).optional(),
    min_review_length: z
      .number()
      .int()
      .min(1, 'Minimum review length must be at least 1')
      .optional(),
    max_review_length: z
      .number()
      .int()
      .min(10, 'Maximum review length must be at least 10')
      .optional(),
    tool_submission_approval: z.nativeEnum(SubmissionApprovalStatus).optional(),
    article_submission_approval: z.nativeEnum(SubmissionApprovalStatus).optional(),
    learning_submission_approval: z.nativeEnum(SubmissionApprovalStatus).optional(),
    admin_notification_email: z.string().email('Invalid admin notification email').optional(),
    notify_admins_for: z.array(z.nativeEnum(EmailNotificationType)).optional(),
    email_service_provider: z.nativeEnum(EmailServiceProvider).optional(),
    smtp_host: z.string().optional(),
    smtp_port: z.number().int().min(1).max(65535).optional(),
    smtp_username: z.string().optional(),
    smtp_password: z.string().optional(),
    from_email: z.string().email('Invalid from email').optional(),
    from_name: z.string().max(255).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })
  .refine(
    (data) => {
      if (data.min_review_length && data.max_review_length) {
        return data.min_review_length <= data.max_review_length;
      }
      return true;
    },
    {
      message: 'Minimum review length must be less than or equal to maximum review length',
      path: ['min_review_length'],
    }
  )
  .refine(
    (data) => {
      if (data.email_service_provider === EmailServiceProvider.SMTP) {
        return data.smtp_host && data.smtp_port && data.smtp_username && data.from_email;
      }
      return true;
    },
    {
      message: 'SMTP host, port, username, and from email are required when using SMTP',
      path: ['smtp_host'],
    }
  );

export const createSiteInformationSchema = z
  .object({
    site_name: z.string().min(1, 'Site name is required').max(255),
    site_description: z.string().min(1, 'Site description is required').max(1000),
    site_tagline: z.string().min(1, 'Site tagline is required').max(255),
    status: z.nativeEnum(SiteStatus).default(SiteStatus.Live),
    maintenance_message: z.string().max(1000).optional(),
    favicon: z.string().url('Invalid favicon URL').optional(),
    social_preview: z.string().url('Invalid social preview URL').optional(),
    meta_title: z.string().max(60, 'Meta title should be less than 60 characters').optional(),
    meta_description: z
      .string()
      .max(160, 'Meta description should be less than 160 characters')
      .optional(),
    sitemap_settings: z.array(z.nativeEnum(SitemapSetting)).default([]),
    google_search_console_verification: z.string().optional(),
    bing_webmaster_tools_verification: z.string().optional(),
    twitter_url: z.string().url('Invalid Twitter URL').optional(),
    github_url: z.string().url('Invalid GitHub URL').optional(),
    linkedin_url: z.string().url('Invalid LinkedIn URL').optional(),
    youtube_url: z.string().url('Invalid YouTube URL').optional(),
    google_analytics_id: z.string().optional(),
    google_tag_manager_id: z.string().optional(),
    facebook_pixel_id: z.string().optional(),
    review_status: z.boolean().default(true),
    review_approval: z.nativeEnum(ReviewApprovalStatus).default(ReviewApprovalStatus.AutoPublish),
    min_review_length: z.number().int().min(1).default(10),
    max_review_length: z.number().int().min(10).default(500),
    tool_submission_approval: z
      .nativeEnum(SubmissionApprovalStatus)
      .default(SubmissionApprovalStatus.AdminApproval),
    article_submission_approval: z
      .nativeEnum(SubmissionApprovalStatus)
      .default(SubmissionApprovalStatus.AdminApproval),
    learning_submission_approval: z
      .nativeEnum(SubmissionApprovalStatus)
      .default(SubmissionApprovalStatus.AdminApproval),
    admin_notification_email: z.string().email('Invalid admin notification email').optional(),
    notify_admins_for: z.array(z.nativeEnum(EmailNotificationType)).default([]),
    email_service_provider: z.nativeEnum(EmailServiceProvider).default(EmailServiceProvider.SMTP),
    smtp_host: z.string().optional(),
    smtp_port: z.number().int().min(1).max(65535).optional(),
    smtp_username: z.string().optional(),
    smtp_password: z.string().optional(),
    from_email: z.string().email('Invalid from email').optional(),
    from_name: z.string().max(255).optional(),
  })
  .refine(
    (data) => {
      return data.min_review_length <= data.max_review_length;
    },
    {
      message: 'Minimum review length must be less than or equal to maximum review length',
      path: ['min_review_length'],
    }
  )
  .refine(
    (data) => {
      if (data.email_service_provider === EmailServiceProvider.SMTP) {
        return data.smtp_host && data.smtp_port && data.smtp_username && data.from_email;
      }
      return true;
    },
    {
      message: 'SMTP host, port, username, and from email are required when using SMTP',
      path: ['smtp_host'],
    }
  );
