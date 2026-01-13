import { z } from 'zod';
import {
  NewsletterFrequency,
  WeekDay,
  SendMode,
  NewsletterTemplateContent,
  FallbackContent,
  NewsletterStatus,
} from '@prisma/client';

export const createNewsletterSchema = {
  body: z.object({
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    template: z.string().min(1, 'Template is required'),
    frequency: z.nativeEnum(NewsletterFrequency).optional(),
    send_day: z.nativeEnum(WeekDay).optional(),
    send_time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM')
      .optional(),
    start_date: z.string().datetime('Invalid date format').optional(),
    is_enabled: z.boolean().optional(),
    send_mode: z.nativeEnum(SendMode).optional(),
    template_type: z.nativeEnum(NewsletterTemplateContent).optional(),
    fallback_type: z.nativeEnum(FallbackContent).optional(),
  }),
};

export const updateNewsletterSchema = {
  body: createNewsletterSchema.body.partial(),
  params: z.object({
    id: z.string().transform(Number),
  }),
};

export const scheduleNewsletterSchema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
};

export const cancelNewsletterSchema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
};

export const getNewsletterSchema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
};

export const getNewslettersSchema = {
  query: z.object({
    page: z.string().transform(Number).optional(),
    limit: z.string().transform(Number).optional(),
    status: z.nativeEnum(NewsletterStatus).optional(),
    frequency: z.nativeEnum(NewsletterFrequency).optional(),
    send_day: z.nativeEnum(WeekDay).optional(),
    send_mode: z.nativeEnum(SendMode).optional(),
    template_type: z.nativeEnum(NewsletterTemplateContent).optional(),
    fallback_type: z.nativeEnum(FallbackContent).optional(),
    is_enabled: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    search: z.string().optional(),
    start_date_from: z.string().datetime().optional(),
    start_date_to: z.string().datetime().optional(),
    created_date_from: z.string().datetime().optional(),
    created_date_to: z.string().datetime().optional(),
    sort_by: z
      .enum(['subject', 'status', 'frequency', 'start_date', 'created_at', 'updated_at'])
      .optional(),
    sort_order: z.enum(['asc', 'desc']).optional(),
  }),
};

export const deleteNewsletterSchema = {
  params: z.object({
    id: z.string().transform(Number),
  }),
};
