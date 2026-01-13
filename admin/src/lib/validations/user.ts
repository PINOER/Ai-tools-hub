import { z } from 'zod';
import { UserStatus } from '@/types/user';

export enum RoleType {
  User = 'User',
  Moderator = 'Moderator',
  Contributor = 'Contributor',
  Admin = 'Admin',
}

export const createUserSchema = z.object({
  username: z.string().min(3, 'Username is required and must be at least 3 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  repeatPassword: z.string().min(1, 'Please repeat your password'),
  role: z.nativeEnum(RoleType),
  status: z.nativeEnum(UserStatus),
  avatar: z.any().refine((file) => file instanceof File, {
    message: 'Avatar is required',
  }),
  provider: z.string(),
  provider_id: z.string(),
  access_token: z.string(),
  bio: z.string().optional(),
  moderation_notes: z.string().optional(),
  sendWelcomeEmail: z.boolean().optional(),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
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
  provider: z.string().optional(),
  provider_id: z.string().optional(),
  access_token: z.string().optional(),
  bio: z.string().optional(),
  moderation_notes: z.string().optional(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>; 