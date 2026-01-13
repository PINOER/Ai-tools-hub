import z from 'zod';
import { Section } from '@prisma/client';

export const createCategorySchema = z.object({
  section: z.nativeEnum(Section),
  name: z.string().min(1, 'Name is required'),
  url_slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
  seo_title: z.string().optional(),
  parentCategoryId: z.number().int().optional(),
});

export const updateCategorySchema = z.object({
  section: z.nativeEnum(Section).optional(),
  name: z.string().min(1).optional(),
  url_slug: z.string().min(1).optional(),
  description: z.string().optional(),
  display_order: z.number().int().optional(),
  seo_title: z.string().optional(),
  parentCategoryId: z.number().int().optional(),
});

export const getCategoriesQuerySchema = z.object({
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  section: z.nativeEnum(Section).optional(),
  search: z.string().optional(),
  parent_id: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
});

export const bulkDeleteSectionCategoriesSchema = z.object({
  categoryIds: z.array(z.number().int()).min(1, 'At least one category ID is required'),
  section: z.nativeEnum(Section),
});
