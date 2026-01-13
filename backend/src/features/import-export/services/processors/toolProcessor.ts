import { Section } from '@prisma/client';
import { CategoryService } from '../../../category/services/category.service.ts';
import { TagService } from '../../../tag/services/tag.service.ts';
import { ToolService } from '../../../tool/services/tool.service.ts';
import logger from '../../../../utils/logger.ts';
import { ToolSubmissionService } from '../../../tool/services/toolSubmission.service.ts';
import { createToolSchema } from '../../../tool/validators/tool.validator.ts';
import { z } from 'zod';
import { parseBoolean, parseSemicolonSeparatedValues } from '../../../../utils/utils.ts';

export class ToolProcessor {
  private categoryService: CategoryService;
  private tagService: TagService;
  private toolSubmissionService: ToolSubmissionService;

  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.toolSubmissionService = new ToolSubmissionService(prisma);
  }

  async processData(rowData: any): Promise<any> {
    return this.processToolData(rowData);
  }

  /**
   * Process tool data from CSV row
   */
  async processToolData(rowData: any): Promise<any> {
    try {
      const transformedData = await this.transformToolData(rowData);

      const toolService = new ToolService(
        this.categoryService,
        this.tagService,
        this.toolSubmissionService,
        this.prisma
      );

      const toolExists = await toolService.checkToolNameExists(transformedData.name);
      if (toolExists) {
        logger.warn(`Tool "${transformedData.name}" already exists, skipping import`);
        throw new Error(
          `Tool "${transformedData.name}" already exists in the database. Skipping import to avoid duplicates.`
        );
      }

      const result = await toolService.createTool(transformedData, 1);
      return result.tool;
    } catch (error) {
      console.log(error);
      logger.error(`Error processing tool data for ${rowData.name}:`, error);

      // Enhance error with more context for better debugging
      if (error && typeof error === 'object') {
        const enhancedError = new Error(
          `Tool creation failed for "${rowData.name}": ${(error as Error).message}`
        );
        (enhancedError as any).originalError = error;
        (enhancedError as any).rowData = rowData;
        throw enhancedError;
      }

      throw error;
    }
  }

  /**
   * Transform CSV row data for tools
   */
  private async transformToolData(csvRow: any): Promise<z.infer<typeof createToolSchema>> {
    const toolData: any = {};

    toolData.name = csvRow.name;
    toolData.short_description = csvRow.short_description;
    toolData.website_url = csvRow.website_url;
    toolData.avatar = csvRow.avatar;
    toolData.full_description = csvRow.full_description;

    // Handle primary category
    if (csvRow.category_name) {
      const categoryId = await this.categoryService.findOrCreateCategoryByName(
        csvRow.category_name,
        'Tool' as Section
      );
      toolData.category_id = categoryId;
    }

    // Handle secondary categories
    if (csvRow.secondary_category_names) {
      const secondaryCategoryNames = parseSemicolonSeparatedValues(csvRow.secondary_category_names);
      const secondaryCategoryIds = await this.categoryService.findOrCreateCategoriesByNames(
        secondaryCategoryNames,
        'Tool' as Section
      );
      toolData.secondary_category_ids = secondaryCategoryIds;
    }

    // Handle tool roles
    if (csvRow.tool_role_names) {
      const roleNames = parseSemicolonSeparatedValues(csvRow.tool_role_names);
      toolData.tool_role_names = roleNames;
    }

    // Handle tool industries
    if (csvRow.tool_industry_names) {
      const industryNames = parseSemicolonSeparatedValues(csvRow.tool_industry_names);
      toolData.tool_industry_names = industryNames;
    }

    // Handle tags
    if (csvRow.tool_tags) {
      const tagNames = parseSemicolonSeparatedValues(csvRow.tool_tags);
      toolData.tool_tags = tagNames;
    } else {
      toolData.tool_tags = [];
    }

    // Handle arrays
    if (csvRow.use_cases) {
      toolData.use_cases = parseSemicolonSeparatedValues(csvRow.use_cases);
    } else {
      toolData.use_cases = [];
    }

    if (csvRow.features) {
      toolData.features = parseSemicolonSeparatedValues(csvRow.features);
    } else {
      toolData.features = [];
    }

    if (csvRow.screenshots) {
      toolData.screenshots = parseSemicolonSeparatedValues(csvRow.screenshots);
    } else {
      toolData.screenshots = [];
    }

    if (csvRow.platform_availability) {
      toolData.platform_availability = parseSemicolonSeparatedValues(csvRow.platform_availability);
    } else {
      toolData.platform_availability = [];
    }

    // Handle social links
    if (csvRow.social_links) {
      const socialUrls = parseSemicolonSeparatedValues(csvRow.social_links);
      toolData.social_links = socialUrls.map((url) => ({
        platform: 'website',
        url: url,
      }));
    } else {
      toolData.social_links = [];
    }

    // Convert boolean strings to actual booleans
    if (csvRow.is_featured !== undefined) {
      toolData.is_featured = parseBoolean(csvRow.is_featured);
    } else {
      toolData.is_featured = false;
    }

    if (csvRow.free_plan_available !== undefined) {
      toolData.free_plan_available = parseBoolean(csvRow.free_plan_available);
    } else {
      toolData.free_plan_available = false;
    }

    if (csvRow.is_unique !== undefined) {
      toolData.is_unique = parseBoolean(csvRow.is_unique);
    } else {
      toolData.is_unique = false;
    }

    // Handle optional fields
    if (csvRow.seo_meta_title) {
      toolData.seo_meta_title = csvRow.seo_meta_title;
    }

    if (csvRow.seo_meta_description) {
      toolData.seo_meta_description = csvRow.seo_meta_description;
    }

    if (csvRow.free_plan_details) {
      toolData.free_plan_details = csvRow.free_plan_details;
    }

    if (csvRow.paid_plan_details) {
      toolData.paid_plan_details = csvRow.paid_plan_details;
    }

    // Set default values for required fields
    if (!toolData.status) {
      toolData.status = 'Pending';
    }

    if (!toolData.pricing_model) {
      toolData.pricing_model = 'Free';
    }

    try {
      const validatedData = createToolSchema.parse(toolData);
      return validatedData;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new Error(`Tool validation failed: ${errorDetails}`);
      }
      throw validationError;
    }
  }

  /**
   * Get tool data for export
   */
  async getExportData(): Promise<{ records: any[]; headers: string[] }> {
    try {
      const tools = await this.prisma.tool.findMany({
        include: {
          tool_categories: {
            include: {
              category: { select: { name: true } },
            },
          },
          tool_tags: {
            include: {
              tag: { select: { name: true } },
            },
          },
          tool_roles: { select: { name: true } },
          tool_industries: { select: { name: true } },
          reviews: { select: { overall_rating: true } },

          _count: { select: { reviews: true } },
        },
      });

      // Transform data for export
      const records = tools.map((tool: any) => {
        const primaryCategory =
          tool.tool_categories?.find((tc: any) => tc.type === 'Primary')?.category?.name || '';
        const secondaryCategories =
          tool.tool_categories
            ?.filter((tc: any) => tc.type === 'Secondary')
            ?.map((tc: any) => tc.category.name)
            ?.join('; ') || '';
        const tags = tool.tool_tags?.map((t: any) => t.tag.name).join('; ') || '';
        const roles = tool.tool_roles?.map((r: any) => r.name).join('; ') || '';
        const industries = tool.tool_industries?.map((i: any) => i.name).join('; ') || '';
        const averageRating =
          tool.reviews?.length > 0
            ? (
                tool.reviews.reduce((sum: number, r: any) => sum + r.overall_rating, 0) /
                tool.reviews.length
              ).toFixed(2)
            : '0';

        return {
          id: tool.id,
          name: tool.name,
          short_description: tool.short_description,
          full_description: tool.full_description,
          website_url: tool.website_url,
          avatar: tool.avatar,
          user_id: tool.user_id,
          status: tool.status,
          is_featured: tool.is_featured,
          is_claimed: tool.is_claimed,
          seo_meta_title: tool.seo_meta_title,
          seo_meta_description: tool.seo_meta_description,
          pricing_model: tool.pricing_model,
          free_plan_available: tool.free_plan_available,
          free_plan_details: tool.free_plan_details,
          paid_plan_details: tool.paid_plan_details,
          platform_availability: tool.platform_availability?.join('; ') || '',
          use_cases: tool.use_cases?.join('; ') || '',
          features: tool.features?.join('; ') || '',
          screenshots: tool.screenshots?.join('; ') || '',
          is_unique: tool.is_unique,
          primary_category: primaryCategory,
          secondary_categories: secondaryCategories,
          tags: tags,
          roles: roles,
          industries: industries,
          average_rating: averageRating,
          review_count: tool._count.reviews,
          created_at: tool.created_at,
          updated_at: tool.updated_at,
        };
      });

      const headers = Object.keys(records[0] || {});

      return { records, headers };
    } catch (error) {
      logger.error('Error fetching tool data for export:', error);
      throw new Error(`Failed to fetch tool data: ${(error as Error).message}`);
    }
  }
}
