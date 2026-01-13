import { z } from 'zod';

// Resource types enum
export const ResourceTypeEnum = z.enum(['News', 'Article', 'Glossary', 'Tool', 'Learning']);

// Sort order enum
export const SortOrderEnum = z.enum(['asc', 'desc']);

// Home data query schema
export const getHomeDataSchema = z.object({
  // Resource types to fetch (comma-separated)
  resources: z
    .string()
    .transform((val) => val.split(','))
    .pipe(z.array(ResourceTypeEnum))
    .optional(),

  // Limit for each resource type
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive().max(50))
    .optional(),

  // Sort order
  sort_order: SortOrderEnum.optional(),

  // Filter by featured items only
  is_featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),

  // Filter by category ID
  category_id: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().int().positive())
    .optional(),

  // Search query
  search: z.string().min(1).optional(),
});
