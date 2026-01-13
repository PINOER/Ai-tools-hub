import { z } from 'zod';
import { ClaimStatus } from '@prisma/client';

export const createToolSubmissionSchema = z.object({
  tool_id: z.number().int().positive(),
});

export const toolIdParamSchema = z.object({
  tool_id: z.string().regex(/^\d+$/).transform(Number),
});

export const updateToolSubmissionStatusSchema = z.object({
  status: z.nativeEnum(ClaimStatus, {
    errorMap: () => ({ message: 'Status must be one of: Pending, Approved, Rejected' }),
  }),
  internal_notes: z.string().optional(),
});

export const getToolSubmissionsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: z.nativeEnum(ClaimStatus).optional(),
  tool_id: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const bulkToolSubmissionReviewSchema = z.object({
  submissions: z
    .array(
      z.object({
        id: z.coerce.number().int().positive('Submission ID must be a positive integer'),
        status: z.nativeEnum(ClaimStatus),
        internal_notes: z.string().max(1000).optional(),
      })
    )
    .min(1, 'At least one submission is required'),
});
