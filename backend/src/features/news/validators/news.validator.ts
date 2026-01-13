import { ArticleStatus, Visibility, ModerationStatus } from '@prisma/client';
import { z } from 'zod';

// Enums based on Prisma schema
export const ArticleStatusEnum = z.nativeEnum(ArticleStatus);
export const VisibilityEnum = z.nativeEnum(Visibility);
export const ModerationStatusEnum = z.nativeEnum(ModerationStatus);

export const createNewsSchema = z.object({
  headline: z
    .string()
    .min(1, 'Headline is required')
    .max(255, 'Headline must be less than 255 characters'),
  seo_title: z.string().max(60, 'SEO title must be less than 60 characters').optional(),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(255, 'URL slug must be less than 255 characters'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().url('Image must be a valid URL').optional(),
  is_featured: z.boolean().default(false),
  status: ArticleStatusEnum.default(ArticleStatus.Draft),
  moderation_status: ModerationStatusEnum.default(ModerationStatus.Pending),
  published_date: z.string().optional(),
  published_time: z.string().optional(),
  visibility: VisibilityEnum.default(Visibility.FeaturedOnHomepage),
  allow_comments: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  category_ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one category is required')
    .optional(),
  secondary_category_ids: z.array(z.number().int().positive()).min(0).max(2).optional(),
});

export const updateNewsSchema = createNewsSchema.extend({}).partial();

export const getNewsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: ArticleStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  search: z.string().optional(),
  user_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  category_ids: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .optional(),
  tags: z.array(z.string()).optional(),

  published_after: z.string().datetime('Published after must be a valid date').optional(),
  published_before: z.string().datetime('Published before must be a valid date').optional(),
  sort_by: z.enum(['asc', 'desc']).optional(),
  sort_field: z.enum(['published_date', 'created_at', 'updated_at', 'headline']).optional(),
});

export const bulkDeleteNewsSchema = z.object({
  news_ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one news ID is required')
    .max(50, 'Maximum 50 news items can be deleted at once'),
});

export const bulkUpdateNewsModerationStatusSchema = z.object({
  news_ids: z.array(z.number()).min(1, 'At least one news ID is required'),
  moderation_status: ModerationStatusEnum,
});

export const updateNewsModerationStatusSchema = z.object({
  moderation_status: ModerationStatusEnum,
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
