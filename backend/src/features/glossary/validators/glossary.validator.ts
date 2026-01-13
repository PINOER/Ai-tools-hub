import { GlossarySource, GlossaryStatus, ModerationStatus } from '@prisma/client';
import { z } from 'zod';

export const createGlossaryTermSchema = z.object({
  term: z.string().min(1, 'Term is required').max(100, 'Term must be less than 100 characters'),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .max(1000, 'Definition must be less than 1000 characters'),
  category_id: z.number().int().positive('Primary category_id is required'), // Use existence middleware for this
  secondary_category_ids: z
    .array(z.number().int().positive())
    .max(2, 'At most two secondary categories allowed')
    .optional(), // Use existence middleware for these
  status: z.nativeEnum(GlossaryStatus).optional(),
  source: z.nativeEnum(GlossarySource).optional(),
  moderation_status: z.nativeEnum(ModerationStatus).optional(),
  allow_comments: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  related_terms: z.array(z.number().int().positive()).optional(),
});

export const updateGlossaryTermSchema = createGlossaryTermSchema.partial();

export const getGlossaryTermsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  category_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  search: z.string().min(1).optional(),
  moderation_status: z.nativeEnum(ModerationStatus).optional(),
  status: z.nativeEnum(GlossaryStatus).optional(),
  source: z.nativeEnum(GlossarySource).optional(),
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),
  user_id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  sort_by: z.enum(['asc', 'desc']).optional(),
});

export const createGlossaryRelationSchema = z.object({
  term_id: z.number().int().positive(),
  related_term_id: z.number().int().positive(),
  relation_type: z.enum(['similar', 'opposite', 'broader', 'narrower'], {
    errorMap: () => ({
      message: 'Relation type must be one of: similar, opposite, broader, narrower',
    }),
  }),
});

export const createGlossaryEditSubmissionSchema = z.object({
  glossary_term_id: z.number().int().positive(),
  term: z.string().min(1, 'Term is required').max(100, 'Term must be less than 100 characters'),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .max(1000, 'Definition must be less than 1000 characters'),
  admin_comment: z.string().optional(),
});

export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.number().int().positive()),
  status: z.nativeEnum(ModerationStatus),
});

export const glossaryIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
