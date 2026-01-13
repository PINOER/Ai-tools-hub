import { RoleType, UserStatus } from '@prisma/client';
import z from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(RoleType),
  status: z.nativeEnum(UserStatus),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  moderation_notes: z.string().optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.nativeEnum(RoleType).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  moderation_notes: z.string().optional(),
});

export const getUsersQuerySchema = z.object({
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().optional()
  ),
  search: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
  role: z.nativeEnum(RoleType).optional(),
});

export const userIdSchema = z.object({
  id: z.number().int().positive('User ID must be a positive integer'),
});

export const bulkUserStatusUpdateSchema = z.object({
  users: z
    .array(
      z.object({
        id: z.number().int().positive(),
        status: z.nativeEnum(UserStatus),
      })
    )
    .min(1),
});

export const bulkUserDeleteSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

export const checkUsernameSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must be less than 255 characters'),
});

export const updateUserPreferencesSchema = z
  .object({
    newsletter_subscribed: z.boolean().optional(),
    email_notifications: z.boolean().optional(),
    search_alerts: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one preference field must be provided',
  });
