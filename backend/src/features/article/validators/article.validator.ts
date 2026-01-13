import { z } from 'zod';
import { ArticleStatus, Visibility, ModerationStatus } from '@prisma/client';

export const ArticleStatusEnum = z.nativeEnum(ArticleStatus);
export const VisibilityEnum = z.nativeEnum(Visibility);
export const ModerationStatusEnum = z.nativeEnum(ModerationStatus);

export const createArticleSchema = z.object({
  headline: z
    .string()
    .min(1, 'Headline is required')
    .max(255, 'Headline must be less than 255 characters'),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(255, 'URL slug must be less than 255 characters'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().url('Invalid image URL').optional(),
  is_featured: z.boolean().default(false),
  status: ArticleStatusEnum.default(ArticleStatus.Draft),
  moderation_status: ModerationStatusEnum.default(ModerationStatus.Pending),
  published_date: z.string().optional(),
  published_time: z.string().optional(),
  visibility: VisibilityEnum.default(Visibility.Public),
  allow_comments: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  category_ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one category is required')
    .optional(),
  secondary_category_ids: z.array(z.number().int().positive()).min(0).max(2).optional(),
});

export const updateArticleSchema = z.object({
  headline: z
    .string()
    .min(1, 'Headline is required')
    .max(255, 'Headline must be less than 255 characters')
    .optional(),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(255, 'URL slug must be less than 255 characters')
    .optional(),
  content: z.string().min(1, 'Content is required').optional(),
  image: z.string().url('Invalid image URL').optional(),
  is_featured: z.boolean().optional(),
  status: ArticleStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  published_date: z.string().optional(),
  published_time: z.string().optional(),
  visibility: VisibilityEnum.optional(),
  allow_comments: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  category_ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one category is required')
    .optional(),
  secondary_category_ids: z.array(z.number().int().positive()).min(0).max(2).optional(),
});

export const articleIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Article ID must be a positive integer'),
});

export const articleStatusQuerySchema = z.object({
  status: ArticleStatusEnum.optional(),
});

export const articleVisibilityQuerySchema = z.object({
  visibility: VisibilityEnum.optional(),
});

export const bulkDeleteArticlesSchema = z.object({
  article_ids: z
    .array(z.number().int().positive('Article ID must be a positive integer'))
    .min(1, 'At least one article ID is required')
    .max(50, 'Maximum 50 articles can be deleted at once'),
});

export const bulkUpdateArticlesSchema = z.object({
  article_ids: z
    .array(z.number().int().positive('Article ID must be a positive integer'))
    .min(1, 'At least one article ID is required')
    .max(50, 'Maximum 50 articles can be updated at once'),
  status: ArticleStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  allow_comments: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const getArticlesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: ArticleStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  category_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  search: z.string().min(1).optional(),
  user_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  sort_by: z.enum(['asc', 'desc']).optional(),
});
