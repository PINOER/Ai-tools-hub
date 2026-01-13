import { z } from 'zod';

export const createToolIndustrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const updateToolIndustrySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const getToolIndustriesQuerySchema = z.object({
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  search: z.string().optional(),
});

export const toolIndustryIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
