import { z } from 'zod';
import { LearningStatus, Visibility, ModerationStatus, SkillLevel } from '@prisma/client';

export const LearningStatusEnum = z.nativeEnum(LearningStatus);
export const VisibilityEnum = z.nativeEnum(Visibility);
export const ModerationStatusEnum = z.nativeEnum(ModerationStatus);
export const SkillLevelEnum = z.nativeEnum(SkillLevel);

export const createLearningSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(255, 'URL slug must be less than 255 characters'),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL'),
  is_featured: z.boolean().default(false),
  status: LearningStatusEnum.default(LearningStatus.Draft),
  moderation_status: ModerationStatusEnum.default(ModerationStatus.Pending),
  skill_level: SkillLevelEnum,
  lesson_link: z.string().url('Invalid lesson link URL'),
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

export const updateLearningSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(255, 'URL slug must be less than 255 characters')
    .optional(),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL').optional(),
  is_featured: z.boolean().optional(),
  status: LearningStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  skill_level: SkillLevelEnum.optional(),
  lesson_link: z.string().url('Invalid lesson link URL').optional(),
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

export const learningIdParamSchema = z.object({
  id: z.coerce.number().int().positive('Learning ID must be a positive integer'),
});

export const learningStatusQuerySchema = z.object({
  status: LearningStatusEnum.optional(),
});

export const learningVisibilityQuerySchema = z.object({
  visibility: VisibilityEnum.optional(),
});

export const bulkDeleteLearningsSchema = z.object({
  learning_ids: z
    .array(z.number().int().positive('Learning ID must be a positive integer'))
    .min(1, 'At least one learning ID is required')
    .max(50, 'Maximum 50 learnings can be deleted at once'),
});

export const bulkUpdateLearningsSchema = z.object({
  learning_ids: z
    .array(z.number().int().positive('Learning ID must be a positive integer'))
    .min(1, 'At least one learning ID is required')
    .max(50, 'Maximum 50 learnings can be updated at once'),
  status: LearningStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  allow_comments: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const getLearningsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: LearningStatusEnum.optional(),
  moderation_status: ModerationStatusEnum.optional(),
  visibility: VisibilityEnum.optional(),
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  skill_level: SkillLevelEnum.optional(),
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
