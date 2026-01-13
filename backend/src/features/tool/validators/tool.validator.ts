import { PlatformAvailability, PricingModel, ToolStatus } from '@prisma/client';
import { z } from 'zod';

// Enums based on Prisma schema
export const ToolStatusEnum = z.nativeEnum(ToolStatus);
export const PricingModelEnum = z.nativeEnum(PricingModel);
export const PlatformAvailabilityEnum = z.nativeEnum(PlatformAvailability);

export const createToolSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  short_description: z.string().min(1, 'Description is required'),
  website_url: z.string().url('Website URL must be a valid URL'),
  avatar: z.string().url('Avatar must be a valid URL'),
  is_featured: z.boolean().default(false),
  category_id: z.number().int().positive(),
  secondary_category_ids: z.array(z.number().int().positive()).min(0).max(2).optional(),
  seo_meta_title: z.string().max(60, 'SEO meta title must be less than 60 characters'),
  seo_meta_description: z
    .string()
    .max(160, 'SEO meta description must be less than 160 characters'),
  pricing_model: PricingModelEnum,
  free_plan_available: z.boolean().default(false),
  free_plan_details: z.string().optional(),
  paid_plan_details: z.string().optional(),
  platform_availability: z.array(PlatformAvailabilityEnum).optional(),
  full_description: z.string(),
  use_cases: z.array(z.string()),
  features: z.array(z.string()),
  screenshots: z.array(z.string().url('Screenshot must be a valid URL')),
  tool_role_ids: z.array(z.number().int().positive('Invalid role ID')).optional(),
  tool_industry_ids: z.array(z.number().int().positive('Invalid industry ID')).optional(),
  // Import fields - role and industry names
  tool_role_names: z.array(z.string()).optional(),
  tool_industry_names: z.array(z.string()).optional(),
  // Related data
  tool_tags: z.array(z.string()),
  is_unique: z.boolean(),
  social_links: z
    .array(
      z.object({
        platform: z.string().min(1, 'Platform is required'),
        url: z.string().url('Social link URL must be valid'),
      })
    )
    .optional(),
  status: ToolStatusEnum.optional(),
});

export const updateToolSchema = createToolSchema.extend({}).partial();

export const getToolsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  status: ToolStatusEnum.optional(),
  category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  search: z.string().optional(),
  user_id: z.string().regex(/^\d+$/).transform(Number).optional(),
  tag_ids: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .optional(),
  pricing_model: z
    .string()
    .transform((val) => val.split(','))
    .pipe(z.array(PricingModelEnum))
    .optional(),
  platform_availability: z
    .string()
    .transform((val) => val.split(','))
    .pipe(z.array(PlatformAvailabilityEnum))
    .optional(),
  is_claimed: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  tool_role_ids: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .optional(),
  tool_industry_ids: z
    .string()
    .transform((val) => val.split(',').map(Number))
    .optional(),
  sort_by: z.enum(['asc', 'desc']).optional(),
});

export const bulkDeleteToolsSchema = z.object({
  tool_ids: z
    .array(z.number().int().positive())
    .min(1, 'At least one tool ID is required')
    .max(50, 'Maximum 50 tools can be deleted at once'),
});
