import { z } from 'zod';

export const idParamSchema = z.object({
  id: z
    .string()
    .refine((val) => /^\d+$/.test(val), {
      message: 'ID must be a numeric string',
    })
    .transform((val) => parseInt(val, 10)),
});
