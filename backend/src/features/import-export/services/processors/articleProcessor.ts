import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { ArticleService } from '../../../article/services/article.service.ts';
import logger from '../../../../utils/logger.ts';
import { createArticleSchema } from '../../../article/validators/article.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class ArticleProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private articleService: ArticleService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.articleService = new ArticleService(prisma);
  }

  /**
   * Process data from CSV row (implements IEntityProcessor interface)
   */
  async processData(rowData: any): Promise<any> {
    return this.processArticleData(rowData);
  }

  /**
   * Process article data from CSV row
   */
  async processArticleData(rowData: any): Promise<any> {
    try {
      // Transform CSV data
      const transformedData = await this.transformArticleData(rowData);

      // Create article using ArticleService
      const result = await this.articleService.createArticle(transformedData, 1); // Admin user ID for imports
      return result;
    } catch (error) {
      logger.error(`Error processing article data for ${rowData.title}:`, error);
      throw error;
    }
  }

  /**
   * Transform CSV row data for article
   */
  private async transformArticleData(csvRow: any): Promise<any> {
    const transformedData: any = {};

    // Handle primary category (category_ids from category_name)
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'Article' as Section
      );
      transformedData.category_ids = [categoryId];
    }

    // Handle secondary categories (secondary_category_ids from secondary_category_names)
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'Article' as Section
      );
      transformedData.secondary_category_ids = secondaryCategoryIds;
    }

    // Basic string fields
    if (csvRow.headline) {
      transformedData.headline = csvRow.headline;
    }

    if (csvRow.url_slug) {
      transformedData.url_slug = csvRow.url_slug;
    }

    if (csvRow.content) {
      transformedData.content = csvRow.content;
    }

    // Optional string fields
    if (csvRow.image) {
      transformedData.image = csvRow.image;
    }

    if (csvRow.tags) {
      const tagNames = parseSemicolonSeparatedValues(csvRow.tags);
      transformedData.tags = tagNames;
    }

    if (csvRow.published_date) {
      transformedData.published_date = csvRow.published_date;
    }

    if (csvRow.published_time) {
      transformedData.published_time = csvRow.published_time;
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

    // Boolean fields
    if (csvRow.is_featured !== undefined) {
      transformedData.is_featured = parseBoolean(csvRow.is_featured);
    }

    if (csvRow.allow_comments !== undefined) {
      transformedData.allow_comments = parseBoolean(csvRow.allow_comments);
    }

    try {
      const validatedData = createArticleSchema.parse(transformedData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Article validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get article data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const articles = await this.prisma.article.findMany({
        include: {
          user: { select: { username: true, first_name: true, last_name: true } },
          articleCategories: {
            include: {
              category: { select: { name: true } },
            },
          },
          articleTags: {
            include: {
              tag: { select: { name: true } },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform data for export
      const records = articles.map((article: any) => {
        const primaryCategory =
          article.articleCategories?.find((ac: any) => ac.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          article.articleCategories
            ?.filter((ac: any) => ac.type === 'Secondary')
            ?.map((ac: any) => ac.category.name)
            ?.join('; ') || '';
        const tags = article.articleTags?.map((at: any) => at.tag.name).join('; ') || '';
        const author =
          `${article.user?.first_name || ''} ${article.user?.last_name || ''}`.trim() ||
          article.user?.username ||
          '';

        return {
          id: article.id,
          headline: article.headline,
          url_slug: article.url_slug,
          content: article.content,
          image: article.image,
          user_id: article.user_id,
          status: article.status,
          moderation_status: article.moderation_status,
          published_date: article.published_date,
          published_time: article.published_time,
          visibility: article.visibility,
          is_featured: article.is_featured,
          allow_comments: article.allow_comments,
          primary_category: primaryCategory,
          secondary_categories: secondaryCategories,
          tags: tags,
          author: author,
          created_at: article.created_at,
          updated_at: article.updated_at,
        };
      });

      const headers = Object.keys(records[0] || {});

      return { records, headers };
    } catch (error) {
      logger.error('Error fetching article data for export:', error);
      throw new Error(`Failed to fetch article data: ${(error as Error).message}`);
    }
  }
}
