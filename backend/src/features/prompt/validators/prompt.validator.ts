import { z } from 'zod';
import { ModerationStatus, PromptStatus } from '@prisma/client';

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, 'Headline is required')
    .max(200, 'Headline must be less than 200 characters'),
  url_slug: z
    .string()
    .min(1, 'URL slug is required')
    .max(100, 'URL slug must be less than 100 characters'),
  category_id: z.number().int().positive(),
  secondary_category_ids: z.array(z.number().int().positive()).min(0).max(2).optional(),
  status: z.nativeEnum(PromptStatus),
  ai_models: z
    .array(z.string().min(1, 'AI model name is required'))
    .min(1, 'At least one AI model is required'),
  short_description: z
    .string()
    .max(500, 'Short description must be less than 500 characters')
    .optional(),
  main_prompt: z
    .string()
    .min(1, 'Main prompt is required')
    .max(5000, 'Main prompt must be less than 5000 characters'),
  user_guide: z.string().max(2000, 'User guide must be less than 2000 characters').optional(),
  tags: z.array(z.string()).optional(),
  allow_comments: z.boolean().default(false),
  published_date: z.string().optional(),
  published_time: z.string().optional(),
});

export const updatePromptSchema = createPromptSchema.partial().extend({
  moderation_status: z.nativeEnum(ModerationStatus).optional(),
});

export const promptIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const getPromptsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: z.nativeEnum(PromptStatus).optional(),
  moderation_status: z.nativeEnum(ModerationStatus).optional(),
  category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  ai_model: z.string().optional(),
  is_featured: z.string().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['asc', 'desc']).optional(),
});

export const createPromptChainSchema = z.object({
  part_number: z.number().int().positive('Part number must be a positive integer'),
  step_title: z
    .string()
    .min(1, 'Step title is required')
    .max(200, 'Step title must be less than 200 characters'),
  step_description: z
    .string()
    .max(500, 'Step description must be less than 500 characters')
    .optional(),
  text: z.string().min(1, 'Text is required').max(2000, 'Text must be less than 2000 characters'),
});

export const updatePromptChainSchema = createPromptChainSchema.partial();

export const promptChainIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});

export const bulkUpdatePromptStatusSchema = z.object({
  prompts: z
    .array(
      z.object({
        id: z.coerce.number().int().positive('Prompt ID must be a positive integer'),
        moderation_status: z.nativeEnum(ModerationStatus),
      })
    )
    .min(1, 'At least one prompt is required'),
});

export const approvePromptsSchema = z.object({
  prompts: z
    .array(
      z.object({
        id: z.number().int().positive('Prompt ID must be a positive integer'),
        status: z.nativeEnum(ModerationStatus),
        moderation_points: z
          .number()
          .int()
          .positive('Moderation points must be a positive integer'),
      })
    )
    .min(1, 'At least one prompt is required'),
});

export const bulkDeletePromptsSchema = z.object({
  promptIds: z
    .array(z.number().int().positive('Prompt ID must be a positive integer'))
    .min(1, 'At least one prompt ID is required'),
  force: z.boolean().optional().default(false),
});
