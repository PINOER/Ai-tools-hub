import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { GlossaryService } from '../../../glossary/services/glossary.service.ts';
import logger from '../../../../utils/logger.ts';
import { createGlossaryTermSchema } from '../../../glossary/validators/glossary.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class GlossaryProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private glossaryService: GlossaryService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.glossaryService = new GlossaryService(prisma);
  }

  /**
   * Process data from CSV row (implements IEntityProcessor interface)
   */
  async processData(rowData: any): Promise<any> {
    return this.processGlossaryData(rowData);
  }

  /**
   * Process glossary data from CSV row
   */
  async processGlossaryData(rowData: any): Promise<any> {
    try {
      // Transform CSV data
      const transformedData = await this.transformGlossaryData(rowData);
      const result = await this.glossaryService.createTerm(transformedData); // Admin user ID for imports
      return result;
    } catch (error) {
      logger.error(`Error processing glossary data for ${rowData.term}:`, error);
      throw error;
    }
  }

  /**
   * Transform CSV row data for glossary
   */
  private async transformGlossaryData(csvRow: any): Promise<any> {
    const transformedData: any = {};

    // Handle primary category (category_id from category_name)
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'Glossary' as Section
      );
      transformedData.category_id = categoryId;
    }

    // Handle secondary categories (secondary_category_ids from secondary_category_names)
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'Glossary' as Section
      );
      transformedData.secondary_category_ids = secondaryCategoryIds;
    }

    // Handle related terms (related_terms from related_term_names)
    if (csvRow.related_term_names) {
      const relatedTermNames = parseSemicolonSeparatedValues(csvRow.related_term_names);
      // Note: You'll need to implement findTermIdsByNames in GlossaryService
      // For now, we'll pass the names and handle the conversion in the service
      transformedData.related_term_names = relatedTermNames;
    }

    // Handle tags (convert from semicolon-separated string to array)
    if (csvRow.tags) {
      const tagNames = parseSemicolonSeparatedValues(csvRow.tags);
      transformedData.tags = tagNames;
    }

    // Basic string fields
    if (csvRow.term) {
      transformedData.term = csvRow.term;
    }

    if (csvRow.definition) {
      transformedData.definition = csvRow.definition;
    }

    // Enum fields
    if (csvRow.status) {
      transformedData.status = csvRow.status;
    }

    if (csvRow.source) {
      transformedData.source = csvRow.source;
    }

    if (csvRow.moderation_status) {
      transformedData.moderation_status = csvRow.moderation_status;
    }

    // Boolean fields
    if (csvRow.allow_comments !== undefined) {
      transformedData.allow_comments = parseBoolean(csvRow.allow_comments);
    }

    try {
      const validatedData = createGlossaryTermSchema.parse(transformedData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Glossary validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get glossary data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const glossaryItems = await this.prisma.glossaryTerm.findMany({
        include: {
          user: { select: { username: true, first_name: true, last_name: true } },
          glossary_categories: {
            include: {
              category: { select: { name: true } },
            },
          },
          glossaryTags: {
            include: {
              tag: { select: { name: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      // Transform data for export
      const records = glossaryItems.map((item: any) => {
        const primaryCategory =
          item.glossary_categories?.find((gc: any) => gc.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          item.glossary_categories
            ?.filter((gc: any) => gc.type === 'Secondary')
            ?.map((gc: any) => gc.category.name)
            ?.join('; ') || '';
        const tags = item.glossaryTags?.map((gt: any) => gt.tag.name).join('; ') || '';
        const author =
          `${item.user?.first_name || ''} ${item.user?.last_name || ''}`.trim() ||
          item.user?.username ||
          '';

        return {
          id: item.id,
          term: item.term,
          definition: item.definition,
          user_id: item.user_id,
          status: item.status,
          moderation_status: item.moderation_status,
          source: item.source,
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
      logger.error('Error fetching glossary data for export:', error);
      throw new Error(`Failed to fetch glossary data: ${(error as Error).message}`);
    }
  }
}
