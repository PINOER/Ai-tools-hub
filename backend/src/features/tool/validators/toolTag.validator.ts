import { z } from 'zod';

export const createToolTagSchema = z.object({
  tool_id: z.number().int().positive(),
  tag_id: z.number().int().positive(),
});
export const updateToolTagSchema = createToolTagSchema;
