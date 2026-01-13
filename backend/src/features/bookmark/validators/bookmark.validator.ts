import { z } from 'zod';
import { BookmarkTargetType } from '@prisma/client';

export const createBookmarkSchema = z.object({
  target_id: z.number().int().positive(),
  target_type: z.nativeEnum(BookmarkTargetType),
});

export const idParamSchema = z.object({
  id: z
    .string()
    .refine((v) => /^\d+$/.test(v), 'ID must be numeric')
    .transform((v) => parseInt(v, 10)),
});

export const getBookmarksQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  target_type: z.nativeEnum(BookmarkTargetType).optional(),
  user_id: z.number().int().positive().optional(),
});
