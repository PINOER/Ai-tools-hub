import { z } from 'zod';

export const createToolRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const updateToolRoleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const getToolRolesQuerySchema = z.object({
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

export const toolRoleIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/).transform(Number),
});
