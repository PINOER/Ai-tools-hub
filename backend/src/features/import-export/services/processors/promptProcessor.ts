import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { PromptService } from '../../../prompt/services/prompt.service.ts';
import logger from '../../../../utils/logger.ts';
import { createPromptSchema } from '../../../prompt/validators/prompt.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class PromptProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private promptService: PromptService;

  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.promptService = new PromptService(prisma);
  }

  /**
   * Process data from CSV row (implements IEntityProcessor interface)
   */
  async processData(rowData: any): Promise<any> {
    return this.processPromptData(rowData);
  }

  /**
   * Process prompt data from CSV row
   */
  async processPromptData(rowData: any): Promise<any> {
    try {
      // Transform CSV data
      const transformedData = await this.transformPromptData(rowData);
      const result = await this.promptService.createPrompt(transformedData, 1, true); // Admin user ID for imports
      return result;
    } catch (error) {
      logger.error(`Error processing prompt data for ${rowData.title}:`, error);
      throw error;
    }
  }

  /**
   * Transform CSV row data for prompt
   */
  private async transformPromptData(csvRow: any): Promise<any> {
    const transformedData: any = {};
    // Handle primary category
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'Prompt' as Section
      );
      transformedData.category_id = categoryId;
    }

    // Handle secondary categories
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'Prompt' as Section
      );
      transformedData.secondary_category_ids = secondaryCategoryIds;
    }

    if (csvRow.url_slug) {
      transformedData.url_slug = csvRow.url_slug;
    }

    if (csvRow.published_date) {
      transformedData.published_date = csvRow.published_date;
    }
    if (csvRow.published_time) {
      transformedData.published_time = csvRow.published_time;
    }

    // Handle tags
    if (csvRow.tags) {
      const tagNames = parseSemicolonSeparatedValues(csvRow.tags);
      transformedData.tags = tagNames;
    }

    if (csvRow.ai_models) {
      transformedData.ai_models = parseSemicolonSeparatedValues(csvRow.ai_models);
    }

    if (csvRow.user_guide) {
      transformedData.user_guide = csvRow.user_guide;
    }

    if (csvRow.is_featured !== undefined) {
      transformedData.is_featured = parseBoolean(csvRow.is_featured);
    }

    if (csvRow.allow_comments !== undefined) {
      transformedData.allow_comments = parseBoolean(csvRow.allow_comments);
    }

    if (csvRow.status) {
      transformedData.status = csvRow.status;
    }

    if (csvRow.title) {
      transformedData.title = csvRow.title;
    }

    if (csvRow.main_prompt) {
      transformedData.main_prompt = csvRow.main_prompt;
    }

    if (csvRow.short_description) {
      transformedData.short_description = csvRow.short_description;
    }

    if (csvRow.long_description) {
      transformedData.long_description = csvRow.long_description;
    }

    try {
      const validatedData = createPromptSchema.parse(transformedData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Prompt validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get prompt data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const prompts = await this.prisma.prompt.findMany({
        include: {
          user: { select: { username: true, first_name: true, last_name: true } },
          promptCategories: {
            include: {
              category: { select: { name: true } },
            },
          },
          promptTags: {
            include: {
              tag: { select: { name: true } },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform data for export
      const records = prompts.map((prompt: any) => {
        const primaryCategory =
          prompt.promptCategories?.find((pc: any) => pc.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          prompt.promptCategories
            ?.filter((pc: any) => pc.type === 'Secondary')
            ?.map((pc: any) => pc.category.name)
            ?.join('; ') || '';
        const tags = prompt.promptTags?.map((pt: any) => pt.tag.name).join('; ') || '';
        const author =
          `${prompt.user?.first_name || ''} ${prompt.user?.last_name || ''}`.trim() ||
          prompt.user?.username ||
          '';

        return {
          id: prompt.id,
          title: prompt.title,
          url_slug: prompt.url_slug,
          user_id: prompt.user_id,
          ai_models: prompt.ai_models.join('; '),
          main_prompt: prompt.main_prompt,
          short_description: prompt.short_description,
          user_guide: prompt.user_guide,
          status: prompt.status,
          moderation_status: prompt.moderation_status,
          moderation_notes: prompt.moderation_notes,
          published_date: prompt.published_date,
          published_time: prompt.published_time,
          is_featured: prompt.is_featured,
          allow_comments: prompt.allow_comments,
          primary_category: primaryCategory,
          secondary_categories: secondaryCategories,
          tags: tags,
          author: author,
          created_at: prompt.created_at,
          updated_at: prompt.updated_at,
        };
      });

      const headers = Object.keys(records[0] || {});

      return { records, headers };
    } catch (error) {
      logger.error('Error fetching prompt data for export:', error);
      throw new Error(`Failed to fetch prompt data: ${(error as Error).message}`);
    }
  }
}
