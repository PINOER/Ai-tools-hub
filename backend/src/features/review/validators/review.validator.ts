import z from 'zod';

import { ReviewStatus } from '@prisma/client';

const reviewCriteriaSchema = z.array(
  z.object({
    name: z.string().min(1, 'Criteria name is required'),
    rating: z.number().min(1, 'Rating is required').max(5),
    comment: z.string().min(1, 'Comment is required'),
  })
);

export const createReviewSchema = z.object({
  tool_id: z.number().int(),
  overall_rating: z.number().min(1).max(5),
  comment: z.string().min(1, 'Comment is required'),
  criteria: reviewCriteriaSchema,
});

export const markHelpfulSchema = z.object({
  review_id: z.number().int().positive('Id must be a positive integer'),
});

export const reportReviewSchema = z.object({
  review_id: z.number().int().positive('Id must be a positive integer'),
  reason: z.string().min(1, 'Reason is required'),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(10),
  status: z.nativeEnum(ReviewStatus).optional(),
  sort_by: z.enum(['recent', 'rating', 'helpful']).optional(),
  tool_id: z.coerce.number().positive('Id must be a positive integer').optional(),
  user_id: z.coerce.number().positive('User ID must be a positive integer').optional(),
  search: z.string().optional(),
});

export const updateReviewSchema = z.object({
  status: z.nativeEnum(ReviewStatus),
  remarks: z.string().min(1, 'Remarks Required'),
});

export const toolIdParams = z.object({
  tool_id: z.coerce.number().positive('Id must be a positive integer'),
});

export const bulkReviewStatusUpdateSchema = z.object({
  reviews: z.array(
    z.object({
      id: z.number().int().positive(),
      status: z.nativeEnum(ReviewStatus),
    })
  ),
});

export const bulkReviewDeleteSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});
