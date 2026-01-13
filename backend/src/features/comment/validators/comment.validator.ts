import { z } from 'zod';
import { CommentStatus, CommentContentType } from '@prisma/client';

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters'),
  content_type: z.nativeEnum(CommentContentType),
  content_id: z.number().int().positive('Content ID must be a positive integer'),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters'),
});

export const updateCommentStatusSchema = z.object({
  status: z.nativeEnum(CommentStatus),
});

export const getCommentsSchema = z.object({
  content_type: z.nativeEnum(CommentContentType).optional(),
  content_id: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive('Content ID must be a positive integer'))
    .optional(),
  page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('10'),
  status: z.nativeEnum(CommentStatus).optional().default('APPROVED'),
  user_id: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive('User ID must be a positive integer'))
    .optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type UpdateCommentStatusInput = z.infer<typeof updateCommentStatusSchema>;
export type GetCommentsInput = z.infer<typeof getCommentsSchema>;
