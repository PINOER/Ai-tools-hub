import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { NewsService } from '../../../news/services/news.service.ts';
import logger from '../../../../utils/logger.ts';
import { createNewsSchema } from '../../../news/validators/news.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class NewsProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private newsService: NewsService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.newsService = new NewsService(this.categoryService, this.tagService, prisma);
  }

  /**
   * Process data from CSV row (implements IEntityProcessor interface)
   */
  async processData(rowData: any): Promise<any> {
    return this.processNewsData(rowData);
  }

  /**
   * Process news data from CSV row
   */
  async processNewsData(rowData: any): Promise<any> {
    try {
      // Transform CSV data
      const transformedData = await this.transformNewsData(rowData);

      // Create news using NewsService
      const result = await this.newsService.createNews(transformedData, 1); // Admin user ID for imports
      return result;
    } catch (error) {
      logger.error(`Error processing news data for ${rowData.title}:`, error);
      throw error;
    }
  }

  /**
   * Transform CSV row data for news
   */
  private async transformNewsData(csvRow: any): Promise<any> {
    const transformedData: any = {};

    // Handle primary category (category_ids from category_name)
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'News' as Section
      );
      transformedData.category_ids = [categoryId];
    }

    // Handle secondary categories (secondary_category_ids from secondary_category_names)
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'News' as Section
      );
      transformedData.secondary_category_ids = secondaryCategoryIds;
    }

    // Basic string fields
    if (csvRow.headline) {
      transformedData.headline = csvRow.headline;
    }

    if (csvRow.seo_title) {
      transformedData.seo_title = csvRow.seo_title;
    }

    if (csvRow.url_slug) {
      transformedData.url_slug = csvRow.url_slug;
    }

    if (csvRow.content) {
      transformedData.content = csvRow.content;
    }

    if (csvRow.image) {
      transformedData.image = csvRow.image;
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

    // Boolean fields
    if (csvRow.is_featured !== undefined) {
      transformedData.is_featured = parseBoolean(csvRow.is_featured);
    }

    if (csvRow.allow_comments !== undefined) {
      transformedData.allow_comments = parseBoolean(csvRow.allow_comments);
    }

    try {
      const validatedData = createNewsSchema.parse(transformedData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`News validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get news data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const newsItems = await this.prisma.news.findMany({
        include: {
          user: { select: { username: true, first_name: true, last_name: true } },
          newsCategories: {
            include: {
              category: { select: { name: true } },
            },
          },
          newsTags: {
            include: {
              tag: { select: { name: true } },
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform data for export
      const records = newsItems.map((item: any) => {
        const primaryCategory =
          item.newsCategories?.find((nc: any) => nc.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          item.newsCategories
            ?.filter((nc: any) => nc.type === 'Secondary')
            ?.map((nc: any) => nc.category.name)
            ?.join('; ') || '';
        const tags = item.newsTags?.map((nt: any) => nt.tag.name).join('; ') || '';
        const author =
          `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim() ||
          item.user?.username ||
          '';

        return {
          id: item.id,
          headline: item.headline,
          seo_title: item.seo_title,
          url_slug: item.url_slug,
          content: item.content,
          image: item.image,
          user_id: item.user_id,
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
      logger.error('Error fetching news data for export:', error);
      throw new Error(`Failed to fetch news data: ${(error as Error).message}`);
    }
  }
}
