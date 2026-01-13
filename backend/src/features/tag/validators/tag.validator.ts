import z from 'zod';

export const createTagSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateTagSchema = z.object({
  name: z.string().min(1).max(100),
});

export const getTagsQuerySchema = z.object({
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

export const tagIdParamSchema = z.object({
  id: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive()
  ),
});
