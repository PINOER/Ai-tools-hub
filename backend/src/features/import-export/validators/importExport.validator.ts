import { z } from 'zod';

// Enums
export const EntityTypeEnum = z.enum([
  'Tool',
  'Prompt',
  'Glossary',
  'News',
  'Article',
  'Learning',
  'Category',
  'Tag',
]);
export const JobTypeEnum = z.enum(['Import', 'Export']);
export const ImportExportStatusEnum = z.enum([
  'Pending',
  'Processing',
  'Completed',
  'Failed',
  'Cancelled',
]);

// Import job request schema
export const importJobRequestSchema = z.object({
  entityType: EntityTypeEnum,
  file: z.any(), // Multer file type
  options: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      try {
        return JSON.parse(val);
      } catch {
        throw new Error('Invalid JSON in options field');
      }
    })
    .pipe(
      z
        .object({
          skipDuplicates: z.boolean().optional(),
          updateExisting: z.boolean().optional(),
          validateOnly: z.boolean().optional(),
        })
        .optional()
    ),
});

// Job filters schema
export const jobFiltersSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  status: ImportExportStatusEnum.optional(),
  entityType: EntityTypeEnum.optional(),
  jobType: JobTypeEnum.optional(),
  adminId: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// Job ID parameter schema
export const jobIdParamSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
});

// Entity type parameter schema
export const entityTypeParamSchema = z.object({
  entityType: EntityTypeEnum,
});

// Retry job schema
export const retryJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
});

// Cancel job schema
export const cancelJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
});

// Generate template schema
export const generateTemplateSchema = z.object({
  entityType: EntityTypeEnum,
});

// Types for use in the application
export type EntityType = z.infer<typeof EntityTypeEnum>;
export type JobType = z.infer<typeof JobTypeEnum>;
export type ImportExportStatus = z.infer<typeof ImportExportStatusEnum>;
export type ImportJobRequest = z.infer<typeof importJobRequestSchema>;
export type JobFilters = z.infer<typeof jobFiltersSchema>;

// Interface definitions for database models
export interface ImportExportJob {
  id: string;
  entityType: EntityType;
  jobType: JobType;
  fileName?: string;
  filePath?: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  status: ImportExportStatus;
  metadata?: any;
  startedAt: Date;
  completedAt?: Date;
  adminId: number;
}

export interface ValidationRule {
  field: string;
  required: boolean;
  type: 'string' | 'number' | 'date' | 'enum' | 'boolean' | 'array';
  minLength?: number;
  maxLength?: number;
  enumValues?: string[];
  customValidator?: (value: any) => boolean;
  transform?: (value: any) => any;
}

export interface EntitySchema {
  entityType: EntityType;
  fields: ValidationRule[];
  requiredFields: string[];
  uniqueFields: string[];
  relationships?: {
    field: string;
    entityType: EntityType;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  }[];
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  processedRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  jobId: string;
}

export interface ExportResult {
  success: boolean;
  filePath: string;
  totalRecords: number;
  jobId: string;
}

export interface CSVRow {
  [key: string]: any;
}

export interface ProcessingOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  validateOnly?: boolean;
  batchSize?: number;
  maxConcurrency?: number;
}
