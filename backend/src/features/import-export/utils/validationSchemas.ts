import { EntityType } from '@prisma/client';
import { ValidationRule, EntitySchema } from '../validators/importExport.validator.ts';

export const entitySchemas: Record<EntityType, EntitySchema> = {
  [EntityType.Tool]: {
    entityType: EntityType.Tool,
    fields: [
      // Core fields (required for import)
      { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'short_description', required: true, type: 'string', minLength: 10, maxLength: 500 },
      { field: 'website_url', required: true, type: 'string' },
      { field: 'avatar', required: true, type: 'string' },
      { field: 'full_description', required: true, type: 'string', minLength: 50 },
      { field: 'use_cases', required: true, type: 'string' },
      { field: 'features', required: true, type: 'string' },
      { field: 'is_unique', required: true, type: 'boolean' },

      // Optional fields
      { field: 'is_featured', required: false, type: 'boolean' },
      { field: 'is_claimed', required: false, type: 'boolean' },
      {
        field: 'status',
        required: false,
        type: 'enum',
        enumValues: ['Pending', 'Approved', 'Rejected', 'Deleted'],
      },
      { field: 'seo_meta_title', required: false, type: 'string', minLength: 1, maxLength: 60 },
      {
        field: 'seo_meta_description',
        required: false,
        type: 'string',
        minLength: 10,
        maxLength: 160,
      },
      {
        field: 'pricing_model',
        required: false,
        type: 'enum',
        enumValues: ['Free', 'Paid', 'Freemium', 'Subscription', 'PaidOnly', 'OneTimePurchase'],
      },
      { field: 'free_plan_available', required: false, type: 'boolean' },
      { field: 'free_plan_details', required: false, type: 'string' },
      { field: 'paid_plan_details', required: false, type: 'string' },
      { field: 'platform_availability', required: false, type: 'string' },
      { field: 'screenshots', required: false, type: 'string' },

      // Relationship fields (handled by service)
      { field: 'user_id', required: false, type: 'number' },
      { field: 'category_name', required: false, type: 'string', minLength: 1, maxLength: 100 },
      { field: 'secondary_category_names', required: false, type: 'string' },
      { field: 'tool_role_names', required: false, type: 'string' },
      { field: 'tool_industry_names', required: false, type: 'string' },
      { field: 'tool_tags', required: false, type: 'string' },
      { field: 'social_links', required: false, type: 'string' },

      // Auto-generated fields (not for import)
      // created_at, updated_at - handled by Prisma
    ],
    requiredFields: [
      'name',
      'short_description',
      'website_url',
      'avatar',
      'full_description',
      'use_cases',
      'features',
      'is_unique',
    ],
    uniqueFields: ['name', 'website_url'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.Prompt]: {
    entityType: EntityType.Prompt,
    fields: [
      { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'content', required: true, type: 'string', minLength: 10 },
      { field: 'description', required: false, type: 'string', maxLength: 1000 },
      {
        field: 'status',
        required: false,
        type: 'enum',
        enumValues: ['Draft', 'Published', 'Scheduled'],
      },
      {
        field: 'difficulty_level',
        required: false,
        type: 'enum',
        enumValues: ['Beginner', 'Intermediate', 'Advanced'],
      },
      { field: 'estimated_time', required: false, type: 'string' },
      { field: 'input_format', required: false, type: 'string' },
      { field: 'output_format', required: false, type: 'string' },
    ],
    requiredFields: ['title', 'content'],
    uniqueFields: ['title'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.Glossary]: {
    entityType: EntityType.Glossary,
    fields: [
      { field: 'term', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'definition', required: true, type: 'string', minLength: 10 },
      { field: 'status', required: false, type: 'enum', enumValues: ['Draft', 'Published'] },
      {
        field: 'source',
        required: false,
        type: 'enum',
        enumValues: ['MANUAL', 'AI_GENERATED', 'IMPORTED'],
      },
      { field: 'is_featured', required: false, type: 'boolean' },
      { field: 'examples', required: false, type: 'string' },
      { field: 'related_terms', required: false, type: 'array' },
    ],
    requiredFields: ['term', 'definition'],
    uniqueFields: ['term'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.News]: {
    entityType: EntityType.News,
    fields: [
      { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'content', required: true, type: 'string', minLength: 10 },
      { field: 'summary', required: false, type: 'string', maxLength: 500 },
      {
        field: 'status',
        required: false,
        type: 'enum',
        enumValues: ['Draft', 'Published', 'Scheduled'],
      },
      { field: 'published_at', required: false, type: 'date' },
      { field: 'source_url', required: false, type: 'string' },
      { field: 'author', required: false, type: 'string' },
      { field: 'is_featured', required: false, type: 'boolean' },
    ],
    requiredFields: ['title', 'content'],
    uniqueFields: ['title'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.Article]: {
    entityType: EntityType.Article,
    fields: [
      { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'content', required: true, type: 'string', minLength: 10 },
      { field: 'summary', required: false, type: 'string', maxLength: 500 },
      {
        field: 'status',
        required: false,
        type: 'enum',
        enumValues: ['Draft', 'Published', 'Scheduled'],
      },
      { field: 'published_at', required: false, type: 'date' },
      { field: 'reading_time', required: false, type: 'number' },
      { field: 'is_featured', required: false, type: 'boolean' },
    ],
    requiredFields: ['title', 'content'],
    uniqueFields: ['title'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.Learning]: {
    entityType: EntityType.Learning,
    fields: [
      { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'content', required: true, type: 'string', minLength: 10 },
      { field: 'description', required: false, type: 'string', maxLength: 1000 },
      {
        field: 'status',
        required: false,
        type: 'enum',
        enumValues: ['Draft', 'Published', 'Scheduled'],
      },
      {
        field: 'skill_level',
        required: false,
        type: 'enum',
        enumValues: ['Beginner', 'Intermediate', 'Advanced'],
      },
      { field: 'estimated_duration', required: false, type: 'string' },
      { field: 'prerequisites', required: false, type: 'array' },
      { field: 'learning_objectives', required: false, type: 'array' },
    ],
    requiredFields: ['title', 'content'],
    uniqueFields: ['title'],
    relationships: [
      { field: 'categories', entityType: EntityType.Category, type: 'many-to-many' },
      { field: 'tags', entityType: EntityType.Tag, type: 'many-to-many' },
    ],
  },

  [EntityType.Category]: {
    entityType: EntityType.Category,
    fields: [
      { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'description', required: false, type: 'string', maxLength: 1000 },
      {
        field: 'type',
        required: false,
        type: 'enum',
        enumValues: ['General', 'Primary', 'Secondary'],
      },
      { field: 'is_active', required: false, type: 'boolean' },
      { field: 'parent_id', required: false, type: 'number' },
    ],
    requiredFields: ['name'],
    uniqueFields: ['name'],
    relationships: [],
  },

  [EntityType.Tag]: {
    entityType: EntityType.Tag,
    fields: [
      { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 255 },
      { field: 'description', required: false, type: 'string', maxLength: 500 },
      { field: 'color', required: false, type: 'string' },
      { field: 'is_active', required: false, type: 'boolean' },
    ],
    requiredFields: ['name'],
    uniqueFields: ['name'],
    relationships: [],
  },
};

export const getEntitySchema = (entityType: EntityType): EntitySchema => {
  return entitySchemas[entityType];
};

export const validateField = (
  value: any,
  rule: ValidationRule
): { isValid: boolean; error?: string } => {
  if (rule.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${rule.field} is required` };
  }

  if (value === null || value === undefined) {
    return { isValid: true };
  }

  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string') {
        return { isValid: false, error: `${rule.field} must be a string` };
      }
      if (rule.minLength && value.length < rule.minLength) {
        return {
          isValid: false,
          error: `${rule.field} must be at least ${rule.minLength} characters`,
        };
      }
      if (rule.maxLength && value.length > rule.maxLength) {
        return {
          isValid: false,
          error: `${rule.field} must be at most ${rule.maxLength} characters`,
        };
      }
      break;

    case 'number':
      if (isNaN(Number(value))) {
        return { isValid: false, error: `${rule.field} must be a number` };
      }
      break;

    case 'boolean':
      if (
        typeof value !== 'boolean' &&
        !['true', 'false', '1', '0'].includes(String(value).toLowerCase())
      ) {
        return { isValid: false, error: `${rule.field} must be a boolean` };
      }
      break;

    case 'date':
      if (isNaN(Date.parse(value))) {
        return { isValid: false, error: `${rule.field} must be a valid date` };
      }
      break;

    case 'enum':
      if (rule.enumValues && !rule.enumValues.includes(value)) {
        return {
          isValid: false,
          error: `${rule.field} must be one of: ${rule.enumValues.join(', ')}`,
        };
      }
      break;

    case 'array':
      if (!Array.isArray(value) && typeof value === 'string') {
        // Handle comma-separated strings
        if (value.includes(',')) {
          return { isValid: true };
        }
      }
      if (!Array.isArray(value)) {
        return { isValid: false, error: `${rule.field} must be an array` };
      }
      break;
  }

  if (rule.customValidator && !rule.customValidator(value)) {
    return { isValid: false, error: `${rule.field} failed custom validation` };
  }

  return { isValid: true };
};

export const transformValue = (value: any, rule: ValidationRule): any => {
  if (rule.transform) {
    return rule.transform(value);
  }

  switch (rule.type) {
    case 'boolean':
      if (typeof value === 'string') {
        return ['true', '1', 'yes'].includes(value.toLowerCase());
      }
      return Boolean(value);

    case 'number':
      return Number(value);

    case 'date':
      return new Date(value);

    case 'array':
      if (typeof value === 'string' && value.includes(',')) {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return Array.isArray(value) ? value : [value];

    default:
      return value;
  }
};
