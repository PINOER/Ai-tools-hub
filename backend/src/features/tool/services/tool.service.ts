import { ToolStatus, Section, CategoryType } from '@prisma/client';
import type { Tool, PricingModel } from '@prisma/client';

import { z } from 'zod';
import {
  createToolSchema,
  getToolsQuerySchema,
  updateToolSchema,
  bulkDeleteToolsSchema,
} from '../validators/tool.validator.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ToolSubmissionService } from './toolSubmission.service.ts';
import { ToolRoleService } from './toolRole.service.ts';
import { ToolIndustryService } from './toolIndustry.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { prisma } from '../../../config/index.ts';
import { getEmbedding } from '@utils/utils.ts';
import { addToolRating, addToolsRatings } from '@utils/rating.utils.ts';

export class ToolService {
  private categoryService: CategoryService;
  private tagService: TagService;
  private toolSubmission: ToolSubmissionService;
  private toolRoleService: ToolRoleService;
  private toolIndustryService: ToolIndustryService;
  private activityService: ActivityService;
  private prisma: any;
  constructor(
    categoryService: CategoryService,
    tagService: TagService,
    toolSubmission: ToolSubmissionService,
    prisma: any
  ) {
    this.categoryService = categoryService;
    this.prisma = prisma;
    this.tagService = tagService;
    this.toolSubmission = toolSubmission;
    this.toolRoleService = new ToolRoleService(prisma);
    this.toolIndustryService = new ToolIndustryService(prisma);
    this.activityService = new ActivityService();
  }

  async createTool(data: z.infer<typeof createToolSchema>, user_id: number) {
    return await this.prisma.$transaction(async (tx: any) => {
      const {
        tool_tags,
        social_links,
        screenshots,
        category_id,
        secondary_category_ids,
        tool_role_ids,
        tool_industry_ids,
        tool_role_names, // Handle role names from imports
        tool_industry_names, // Handle industry names from imports
        ...toolData
      } = data;

      // Validate categories exist
      const allCategoryIds: number[] = [];
      if (category_id) {
        allCategoryIds.push(category_id);
      }
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        allCategoryIds.push(...secondary_category_ids);
      }

      if (allCategoryIds.length > 3) {
        throw new Error('Maximum 3 categories allowed (1 primary + 2 secondary)');
      }

      if (allCategoryIds.length > 0) {
        await this.categoryService.validateCategoriesExist(allCategoryIds, Section.Tool);
      }

      const tagIds = tool_tags?.length ? await this.tagService.getOrCreateTags(tool_tags, tx) : [];

      // Handle tool roles from names (for imports)
      let finalToolRoleIds = tool_role_ids || [];
      if (tool_role_names && Array.isArray(tool_role_names)) {
        const roleIds = await this.toolRoleService.findOrCreateToolRoles(tool_role_names);
        finalToolRoleIds = [...finalToolRoleIds, ...roleIds];
      }

      // Handle tool industries from names (for imports)
      let finalToolIndustryIds = tool_industry_ids || [];
      if (tool_industry_names && Array.isArray(tool_industry_names)) {
        const industryIds =
          await this.toolIndustryService.findOrCreateToolIndustries(tool_industry_names);
        finalToolIndustryIds = [...finalToolIndustryIds, ...industryIds];
      }
      const toolSubmitter = await tx.user.findUnique({
        where: { id: user_id },
        select: { id: true, role: true },
      });
      if (toolSubmitter?.role.role === 'Admin') {
        toolData.status = ToolStatus.Approved;
      }

      const createdTool = await tx.tool.create({
        data: {
          ...toolData,
          user_id,
          ...(screenshots && { screenshots }),
          pricing_model: toolData.pricing_model as PricingModel,
          platform_availability: toolData.platform_availability,

          ...(tagIds.length && {
            tool_tags: {
              create: tagIds.map((tagId: number) => ({ tag_id: tagId })),
            },
          }),

          ...(social_links &&
            social_links.length > 0 && {
              social_links: {
                create: social_links.map((link: any) => ({
                  platform: link.platform,
                  url: link.url,
                })),
              },
            }),
          ...(finalToolRoleIds.length > 0 && {
            tool_roles: {
              connect: finalToolRoleIds.map((roleId: number) => ({ id: roleId })),
            },
          }),
          ...(finalToolIndustryIds.length > 0 && {
            tool_industries: {
              connect: finalToolIndustryIds.map((industryId: number) => ({ id: industryId })),
            },
          }),
        },
      });

      const sourceText = `${toolData.name} ${data.short_description ?? ''} ${toolData.full_description ?? ''}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createTool', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Tool" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          createdTool.id
        );
      }

      // Create primary category
      if (category_id) {
        await tx.toolCategory.create({
          data: {
            tool_id: createdTool.id,
            category_id: category_id,
            type: CategoryType.Primary,
          },
        });
      }

      // Create secondary categories
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        for (const secCatId of secondary_category_ids) {
          await tx.toolCategory.create({
            data: {
              tool_id: createdTool.id,
              category_id: secCatId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      const submission = await this.toolSubmission.createToolSubmission(
        {
          tool_id: createdTool.id,
          user_id,
        },
        tx
      );

      // Log activity
      await this.activityService.logToolSubmission(createdTool.name, user_id);

      return {
        tool: createdTool,
        submission,
      };
    });
  }

  static async toolExists(id: number): Promise<boolean> {
    const tool = await prisma.tool.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!tool;
  }

  async getToolById(id: number, isAdmin: boolean = false) {
    const where: any = { id };

    // For non-admin users, only show approved tools
    if (!isAdmin) {
      where.status = ToolStatus.Approved;
    }

    const tool = await this.prisma.tool.findFirst({
      where,
      select: {
        id: true,
        name: true,
        short_description: true,
        website_url: true,
        avatar: true,
        is_claimed: true,
        is_featured: true,
        status: true,
        tool_categories: true,
        seo_meta_title: true,
        seo_meta_description: true,
        pricing_model: true,
        free_plan_available: true,
        free_plan_details: true,
        paid_plan_details: true,
        platform_availability: true,
        full_description: true,
        use_cases: true,
        features: true,
        screenshots: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },

        tool_tags: {
          include: {
            tag: true,
          },
        },
        social_links: true,
        reviews: {
          where: isAdmin ? undefined : { status: 'Approved' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        },
        tool_industries: true,
        tool_roles: true,
        tool_claims: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return tool ? addToolRating(tool) : null;
  }

  async getAllTools(query: z.infer<typeof getToolsQuerySchema>, isAdmin: boolean = false) {
    const {
      page,
      limit,
      status,
      category_id,
      is_featured,
      search,
      user_id,
      tag_ids,
      pricing_model,
      platform_availability,
      is_claimed,
      tool_role_ids,
      tool_industry_ids,
      sort_by,
    } = query;
    const skip = (page - 1) * limit;
    let orderBy: any = {};
    if (sort_by) {
      orderBy = {
        name: sort_by,
      };
    } else {
      orderBy = {
        created_at: 'desc',
      };
    }

    const where: any = {};
    if (!isAdmin) {
      where.status = ToolStatus.Approved;
    } else if (status) {
      where.status = status as ToolStatus;
    }

    if (user_id && isAdmin) {
      where.user_id = user_id;
    }

    if (category_id) {
      where.tool_categories = {
        some: {
          category_id: category_id,
          type: CategoryType.Primary,
        },
      };
    }

    if (is_featured !== undefined) {
      where.is_featured = is_featured;
    }

    if (pricing_model && pricing_model.length > 0) {
      where.pricing_model = {
        in: pricing_model,
      };
    }

    if (platform_availability && platform_availability.length > 0) {
      where.platform_availability = {
        hasSome: platform_availability,
      };
    }

    if (is_claimed !== undefined) {
      where.is_claimed = is_claimed;
    }

    if (tag_ids && tag_ids.length > 0) {
      where.tool_tags = {
        some: {
          tag_id: {
            in: tag_ids,
          },
        },
      };
    }

    if (tool_role_ids && tool_role_ids.length > 0) {
      where.tool_roles = {
        some: {
          id: {
            in: tool_role_ids,
          },
        },
      };
    }

    if (tool_industry_ids && tool_industry_ids.length > 0) {
      where.tool_industries = {
        some: {
          id: {
            in: tool_industry_ids,
          },
        },
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          short_description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          full_description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [tools, total] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          tool_categories: {
            include: {
              category: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          tool_tags: {
            include: {
              tag: true,
            },
          },
          tool_roles: {
            select: {
              id: true,
              name: true,
            },
          },
          tool_industries: {
            select: {
              id: true,
              name: true,
            },
          },
          social_links: true,
          reviews: true,
        },
        orderBy,
      }),
      this.prisma.tool.count({ where }),
    ]);

    return {
      tools: addToolsRatings(tools),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateTool(id: number, data: z.infer<typeof updateToolSchema>): Promise<Tool> {
    const {
      tool_tags,
      social_links,
      screenshots,
      category_id,
      secondary_category_ids,
      tool_role_ids,
      tool_industry_ids,
      ...toolData
    } = data;

    return await this.prisma.$transaction(async (tx: any) => {
      // Check for duplicate tool names if name is being updated
      if (toolData.name) {
        const isDuplicate = await this.checkToolNameExists(toolData.name, id);
        if (isDuplicate) {
          throw new Error(
            `Tool name "${toolData.name}" already exists. Please choose a different name.`
          );
        }
      }

      // Validate categories exist if provided
      if (category_id || secondary_category_ids) {
        const allCategoryIds: number[] = [];
        if (category_id) {
          allCategoryIds.push(category_id);
        }
        if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
          allCategoryIds.push(...secondary_category_ids);
        }

        if (allCategoryIds.length > 3) {
          throw new Error('Maximum 3 categories allowed (1 primary + 2 secondary)');
        }

        if (allCategoryIds.length > 0) {
          await this.categoryService.validateCategoriesExist(allCategoryIds, Section.Tool);
        }
      }

      const tagIds = tool_tags?.length ? await this.tagService.getOrCreateTags(tool_tags, tx) : [];

      const updateData: any = {
        ...toolData,
      };

      if (screenshots) {
        updateData.screenshots = screenshots;
      }

      const updatedTool = await tx.tool.update({
        where: { id },
        data: {
          ...updateData,
          ...(tool_tags && {
            tool_tags: {
              deleteMany: {},
              create: tagIds.map((tagId: number) => ({
                tag_id: tagId,
              })),
            },
          }),
          ...(social_links &&
            social_links.length > 0 && {
              social_links: {
                deleteMany: {},
                create: social_links,
              },
            }),
          ...(tool_role_ids && {
            tool_roles: {
              set: tool_role_ids.map((roleId: number) => ({ id: roleId })),
            },
          }),
          ...(tool_industry_ids && {
            tool_industries: {
              set: tool_industry_ids.map((industryId: number) => ({ id: industryId })),
            },
          }),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          tool_tags: {
            include: {
              tag: true,
            },
          },
          social_links: true,
        },
      });

      // update embeddings
      const sourceText = `${toolData.name ?? ''} ${toolData.short_description ?? ''} ${toolData.full_description ?? ''}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at updateTool', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Tool" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          id
        );
      }

      // Update categories if provided
      if (category_id || secondary_category_ids) {
        // Delete existing categories
        await tx.toolCategory.deleteMany({
          where: { tool_id: id },
        });

        // Create primary category
        if (category_id) {
          await tx.toolCategory.create({
            data: {
              tool_id: id,
              category_id: category_id,
              type: CategoryType.Primary,
            },
          });
        }

        // Create secondary categories
        if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
          for (const secCatId of secondary_category_ids) {
            await tx.toolCategory.create({
              data: {
                tool_id: id,
                category_id: secCatId,
                type: CategoryType.Secondary,
              },
            });
          }
        }
      }

      return updatedTool;
    });
  }

  async bulkDeleteTools(
    data: z.infer<typeof bulkDeleteToolsSchema>
  ): Promise<{ deletedCount: number; deletedIds: number[] }> {
    const { tool_ids } = data;

    return await this.prisma.$transaction(async (tx: any) => {
      // First, check if all tools exist
      const existingTools = await tx.tool.findMany({
        where: {
          id: {
            in: tool_ids,
          },
        },
        select: { id: true },
      });

      const existingIds = existingTools.map((tool: any) => tool.id);
      const missingIds = tool_ids.filter((id: number) => !existingIds.includes(id));

      if (missingIds.length > 0) {
        throw new Error(`Tools not found: ${missingIds.join(', ')}`);
      }

      await tx.toolCategory.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      await tx.toolTag.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      await tx.socialLink.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      // Get all review IDs for these tools first
      const reviews = await tx.review.findMany({
        where: { tool_id: { in: tool_ids } },
        select: { id: true },
      });
      const reviewIds = reviews.map((review: any) => review.id);

      // Delete review-related records first (in correct order)
      if (reviewIds.length > 0) {
        await tx.reviewCriteria.deleteMany({
          where: { review_id: { in: reviewIds } },
        });

        await tx.reviewModeration.deleteMany({
          where: { review_id: { in: reviewIds } },
        });

        await tx.reviewHelpfulVote.deleteMany({
          where: { review_id: { in: reviewIds } },
        });

        await tx.reviewReport.deleteMany({
          where: { review_id: { in: reviewIds } },
        });
      }

      // Now delete the reviews themselves
      await tx.review.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      await tx.toolClaim.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      await tx.toolSubmission.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      await tx.toolComparisonTool.deleteMany({
        where: { tool_id: { in: tool_ids } },
      });

      // Finally, delete all tools
      const deleteResult = await tx.tool.deleteMany({
        where: {
          id: {
            in: tool_ids,
          },
        },
      });

      return {
        deletedCount: deleteResult.count,
        deletedIds: tool_ids,
      };
    });
  }

  async deleteTool(id: number, authenticatedUserId: number): Promise<Tool> {
    // Get tool info before deletion for activity logging
    const tool = await this.prisma.tool.findUnique({
      where: { id },
      select: { name: true, user_id: true },
    });

    if (!tool) {
      throw new Error('Tool not found');
    }

    // Delete all tool categories first
    await this.prisma.toolCategory.deleteMany({
      where: { tool_id: id },
    });

    await this.prisma.toolTag.deleteMany({
      where: { tool_id: id },
    });

    await this.prisma.socialLink.deleteMany({
      where: { tool_id: id },
    });

    // Get all review IDs for this tool first
    const reviews = await this.prisma.review.findMany({
      where: { tool_id: id },
      select: { id: true },
    });
    const reviewIds = reviews.map((review: any) => review.id);

    // Delete review-related records first (in correct order)
    if (reviewIds.length > 0) {
      await this.prisma.reviewCriteria.deleteMany({
        where: { review_id: { in: reviewIds } },
      });

      await this.prisma.reviewModeration.deleteMany({
        where: { review_id: { in: reviewIds } },
      });

      await this.prisma.reviewHelpfulVote.deleteMany({
        where: { review_id: { in: reviewIds } },
      });

      await this.prisma.reviewReport.deleteMany({
        where: { review_id: { in: reviewIds } },
      });
    }

    // Now delete the reviews themselves
    await this.prisma.review.deleteMany({
      where: { tool_id: id },
    });

    await this.prisma.toolClaim.deleteMany({
      where: { tool_id: id },
    });

    await this.prisma.toolSubmission.deleteMany({
      where: { tool_id: id },
    });

    await this.prisma.toolComparisonTool.deleteMany({
      where: { tool_id: id },
    });

    const deletedTool = await this.prisma.tool.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logContentDeleted('Tool', tool.name, authenticatedUserId);

    return deletedTool;
  }

  async updateToolStatus(
    id: number,
    status: ToolStatus,
    authenticatedUserId: number
  ): Promise<Tool> {
    const tool = await this.prisma.tool.update({
      where: { id },
      data: { status },
    });

    // Log activity based on status change
    if (status === ToolStatus.Approved) {
      await this.activityService.logToolApproval(tool.name, authenticatedUserId);
    } else if (status === ToolStatus.Rejected) {
      await this.activityService.logActivity({
        title: 'Tool Rejected',
        description: `${tool.name} rejected`,
        icon: '❌',
        user_id: authenticatedUserId,
        entity_type: 'tool',
        entity_name: tool.name,
      });
    }

    return tool;
  }

  /**
   * Check if a tool name already exists (case-insensitive)
   * This prevents exact duplicates like "Notion" vs "notion"
   */
  async checkToolNameExists(toolName: string, excludeId?: number): Promise<boolean> {
    const normalizedName = toolName.trim();

    const existingTool = await this.prisma.tool.findFirst({
      where: {
        AND: [
          { name: { equals: normalizedName, mode: 'insensitive' } },
          ...(excludeId ? [{ id: { not: excludeId } }] : []),
        ],
      },
      select: { id: true, name: true },
    });

    return !!existingTool;
  }
}
