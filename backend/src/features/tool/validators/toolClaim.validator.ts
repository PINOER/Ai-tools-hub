import { z } from 'zod';
import { ClaimStatus, Relationship } from '@prisma/client';

export const createToolClaimSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  job: z.string().min(1, 'Job title is required'),
  company_email: z.string().email('Invalid company email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid international phone number'),
  relationship: z.nativeEnum(Relationship, { message: 'Invalid relationship type' }),
  company_website: z.string().url('Invalid company website URL'),
  tool_website: z.string().url('Invalid tool website URL').optional(),
  company_image: z.string().url('Company image is required'),
  professional_profile: z.string().url('Professional profile is required'),
  additional_information: z.string().min(1, 'Additional information is required'),
});

export const toolIdParamSchema = z.object({
  tool_id: z.string().regex(/^\d+$/).transform(Number),
});

export const updateToolClaimSchema = createToolClaimSchema.extend({}).partial();

export const updateToolClaimReviewSchema = z.object({
  status: z.nativeEnum(ClaimStatus).optional(),
  review_notes: z.string().max(1000).optional(),
});

export const toolClaimStatusQuerySchema = z.object({
  status: z.nativeEnum(ClaimStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const bulkToolClaimReviewSchema = z.object({
  claims: z
    .array(
      z.object({
        id: z.coerce.number().int().positive('Claim ID must be a positive integer'),
        status: z.nativeEnum(ClaimStatus),
        review_notes: z.string().max(1000).optional(),
      })
    )
    .min(1, 'At least one claim is required'),
});

export const bulkDeleteToolClaimsSchema = z.object({
  claim_ids: z
    .array(z.number().int().positive('Claim ID must be a positive integer'))
    .min(1, 'At least one claim ID is required')
    .max(50, 'Maximum 50 claims can be deleted at once'),
});
