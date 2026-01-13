import { z } from 'zod';

const validEntities = ['Tool', 'News', 'Article', 'Learning', 'Prompt', 'GlossaryTerm'] as const;

export const relatednessParamSchema = z.object({
  entity: z.enum(validEntities, {
    errorMap: () => ({ message: 'Invalid entity type' }),
  }),
  id: z.coerce.number().int().positive('Entity ID must be a positive integer'),
});
