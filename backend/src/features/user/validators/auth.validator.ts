import { z } from 'zod';
import { createUserSchema } from './user.validator.ts';
import { Provider } from '@prisma/client';

// Register schema (reuse createUserSchema)
export const registerSchema = createUserSchema;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Enhanced social login schema
export const socialLoginSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  provider: z.nativeEnum(Provider),
  providerId: z.string().min(1),
  avatarUrl: z.string().url().optional(),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

// Logout schema
export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});
