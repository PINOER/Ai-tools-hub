import { z } from 'zod';

export const generatePresignedUrlSchema = z.object({
  imageName: z
    .string()
    .min(1, 'Image name is required')
    .max(255, 'Image name must be less than 255 characters'),
});
