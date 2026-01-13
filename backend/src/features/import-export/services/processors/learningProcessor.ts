import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { LearningService } from '../../../learning/services/learning.service.ts';
import logger from '../../../../utils/logger.ts';
import { createLearningSchema } from '../../../learning/validators/learning.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class LearningProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private learningService: LearningService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.learningService = new LearningService(prisma);
  }

  /**
   * Process data from CSV row (implements IEntityProcessor interface)
   */
  async processData(rowData: any): Promise<any> {
    return this.processLearningData(rowData);
  }

  /**
   * Process learning data from CSV row
   */
  async processLearningData(rowData: any): Promise<any> {
    try {
      // Transform CSV data
      const transformedData = await this.transformLearningData(rowData);

      // Create learning using LearningService
      const result = await this.learningService.createLearning(transformedData, 1); // Admin user ID for imports
      return result;
    } catch (error) {
      logger.error(`Error processing learning data for ${rowData.title}:`, error);
      throw error;
    }
  }

  /**
   * Transform CSV row data for learning
   */
  private async transformLearningData(csvRow: any): Promise<any> {
    const transformedData: any = {};

    // Handle primary category (category_ids from category_name)
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'Learning' as Section
      );
      transformedData.category_ids = [categoryId];
    }

    // Handle secondary categories (secondary_category_ids from secondary_category_names)
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'Learning' as Section
      );
      transformedData.secondary_category_ids = secondaryCategoryIds;
    }

    // Basic string fields
    if (csvRow.title) {
      transformedData.title = csvRow.title;
    }

    if (csvRow.url_slug) {
      transformedData.url_slug = csvRow.url_slug;
    }

    if (csvRow.description) {
      transformedData.description = csvRow.description;
    }

    if (csvRow.image) {
      transformedData.image = csvRow.image;
    }

    if (csvRow.lesson_link) {
      transformedData.lesson_link = csvRow.lesson_link;
    }

    if (csvRow.published_date) {
      transformedData.published_date = csvRow.published_date;
    }

    if (csvRow.published_time) {
      transformedData.published_time = csvRow.published_time;
    }

    // Handle tags (convert from semicolon-separated string to array)
    if (csvRow.tags) {
      const tagNames = parseSemicolonSeparatedValues(csvRow.tags);
      transformedData.tags = tagNames;
    }

    // Enum fields
    if (csvRow.status) {
      transformedData.status = csvRow.status;
    }

    if (csvRow.moderation_status) {
      transformedData.moderation_status = csvRow.moderation_status;
    }

    if (csvRow.visibility) {
      transformedData.visibility = csvRow.visibility;
    }

    if (csvRow.skill_level) {
      const skillLevel = csvRow.skill_level.toLowerCase();
      if (['beginner', 'intermediate', 'advanced'].includes(skillLevel)) {
        transformedData.skill_level = skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1);
      } else {
        transformedData.skill_level = 'Beginner';
      }
    } else {
      transformedData.skill_level = 'Beginner';
    }

    // Boolean fields
    if (csvRow.is_featured !== undefined) {
      transformedData.is_featured = parseBoolean(csvRow.is_featured);
    }

    if (csvRow.allow_comments !== undefined) {
      transformedData.allow_comments = parseBoolean(csvRow.allow_comments);
    }

    try {
      const validatedData = createLearningSchema.parse(transformedData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Learning validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get learning data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const learningItems = await this.prisma.learning.findMany({
        include: {
          user: { select: { username: true, first_name: true, last_name: true } },
          learningCategories: {
            include: {
              category: { select: { name: true } },
            },
          },
          learningTags: {
            include: {
              tag: { select: { name: true } },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform data for export
      const records = learningItems.map((item: any) => {
        const primaryCategory =
          item.learningCategories?.find((lc: any) => lc.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          item.learningCategories
            ?.filter((lc: any) => lc.type === 'Secondary')
            ?.map((lc: any) => lc.category.name)
            ?.join('; ') || '';
        const tags = item.learningTags?.map((lt: any) => lt.tag.name).join('; ') || '';
        const author =
          `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim() ||
          item.user?.username ||
          '';

        return {
          id: item.id,
          title: item.title,
          url_slug: item.url_slug,
          description: item.description,
          image: item.image,
          user_id: item.user_id,
          skill_level: item.skill_level,
          lesson_link: item.lesson_link,
          status: item.status,
          moderation_status: item.moderation_status,
          published_date: item.published_date,
          published_time: item.published_time,
          visibility: item.visibility,
          is_featured: item.is_featured,
          allow_comments: item.allow_comments,
          primary_category: primaryCategory,
          secondary_categories: secondaryCategories,
          tags: tags,
          author: author,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });

      const headers = Object.keys(records[0] || {});

      return { records, headers };
    } catch (error) {
      logger.error('Error fetching learning data for export:', error);
      throw new Error(`Failed to fetch learning data: ${(error as Error).message}`);
    }
  }
}
