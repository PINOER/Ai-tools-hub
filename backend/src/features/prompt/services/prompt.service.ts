import { prisma } from '../../../config/index.ts';
import { z } from 'zod';
import {
  createPromptSchema,
  updatePromptSchema,
  getPromptsQuerySchema,
} from '../validators/prompt.validator.ts';
import { CategoryType, ModerationStatus, PromptStatus, Section } from '@prisma/client';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { getEmbedding, parseDateField } from '../../../utils/utils.ts';

export class PromptService {
  private categoryService: CategoryService;
  private tagService: TagService;
  private activityService: ActivityService;
  private prisma: any;

  constructor(prisma?: any) {
    this.prisma = prisma || prisma;
    this.categoryService = new CategoryService(prisma);
    this.tagService = new TagService(prisma);
    this.activityService = new ActivityService();
  }

  async createPrompt(data: z.infer<typeof createPromptSchema>, user_id: number, isAdmin: boolean) {
    return await this.prisma.$transaction(async (tx: any) => {
      const existingPrompt = await tx.prompt.findFirst({
        where: { url_slug: data.url_slug },
      });

      if (existingPrompt) {
        throw new Error('URL slug already exists');
      }

      // Handle tags
      const tagIds = data.tags?.length ? await this.tagService.getOrCreateTags(data.tags, tx) : [];

      // Create the prompt
      const prompt = await tx.prompt.create({
        data: {
          title: data.title,
          moderation_status: isAdmin ? ModerationStatus.Approved : ModerationStatus.Pending,
          url_slug: data.url_slug,
          status: data.status,
          ai_models: data.ai_models,
          main_prompt: data.main_prompt,
          short_description: data.short_description,
          user_guide: data.user_guide,
          published_date: parseDateField(data.published_date),
          published_time: data.published_time,
          allow_comments: data.allow_comments,
          user_id,
          ...(tagIds.length && {
            promptTags: {
              create: tagIds.map((tagId: number) => ({ tag_id: tagId })),
            },
          }),
        },
      });

      const sourceText = `${data.title} ${data.short_description ?? ''} ${data.main_prompt ?? ''}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createPrompt', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Prompt" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          prompt.id
        );
      }

      if (data.category_id) {
        await tx.promptCategory.create({
          data: {
            prompt_id: prompt.id,
            category_id: data.category_id,
            type: CategoryType.Primary,
          },
        });
      }

      if (data.secondary_category_ids && Array.isArray(data.secondary_category_ids)) {
        for (const secCatId of data.secondary_category_ids) {
          await tx.promptCategory.create({
            data: {
              prompt_id: prompt.id,
              category_id: secCatId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      // Log activity
      await this.activityService.logContentCreated('Prompt', prompt.title, user_id);

      return prompt;
    });
  }

  async getPrompt(id: number) {
    const prompt = await this.prisma.prompt.findUnique({
      where: { id },
      include: {
        promptCategories: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
          },
        },
        promptTags: {
          include: {
            tag: true,
          },
        },
        promptChains: {
          orderBy: { part_number: 'asc' },
        },
        votes: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!prompt) {
      throw new Error('Prompt not found');
    }

    return prompt;
  }

  async getAllPrompts(query?: z.infer<typeof getPromptsQuerySchema>, isAdmin?: boolean) {
    const { page = 1, limit = 10, status, category_id, ai_model, search, sort_by } = query || {};
    let orderBy: any = {};
    if (sort_by) {
      orderBy = {
        title: sort_by,
      };
    } else {
      orderBy = {
        published_date: 'desc',
      };
    }
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    if (query?.moderation_status) {
      where.moderation_status = query.moderation_status;
    }

    if (!isAdmin) {
      where.status = PromptStatus.Published;
      where.moderation_status = ModerationStatus.Approved;
    }

    if (category_id) {
      where.promptCategories = {
        some: {
          category_id: category_id,
        },
      };
    }

    // Filter by AI model
    if (ai_model) {
      where.ai_models = {
        has: ai_model,
      };
    }

    // Search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        { main_prompt: { contains: search, mode: 'insensitive' } },
        {
          promptTags: {
            some: {
              tag: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const [prompts, total] = await Promise.all([
      this.prisma.prompt.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          promptCategories: {
            include: {
              category: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
            },
          },
          promptTags: {
            include: {
              tag: true,
            },
          },
          promptChains: {
            orderBy: { part_number: 'asc' },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
      }),
      this.prisma.prompt.count({ where }),
    ]);

    return {
      data: prompts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async updatePrompt(
    id: number,
    data: z.infer<typeof updatePromptSchema>,
    user_id: number,
    isAdmin: boolean
  ) {
    const isAuthorized = await PromptService.promptExists(id, isAdmin ? undefined : user_id);

    if (!isAuthorized) {
      throw new Error('Prompt not found');
    }

    return await this.prisma.$transaction(async (tx: any) => {
      const prompt = await this.getPrompt(id);
      if (!prompt) {
        throw new Error('Prompt not found');
      }

      if (data.url_slug && data.url_slug !== prompt.url_slug) {
        const existingPrompt = await tx.prompt.findFirst({
          where: { url_slug: data.url_slug },
        });

        if (existingPrompt) {
          throw new Error('URL slug already exists');
        }
      }

      // Prepare update data with only valid prompt fields
      const updateData: any = {};

      // Only include fields that exist in the Prompt model
      if (data.title) updateData.title = data.title;
      if (data.url_slug) updateData.url_slug = data.url_slug;
      if (data.status) updateData.status = data.status;
      if (data.ai_models) updateData.ai_models = data.ai_models;
      if (data.short_description !== undefined)
        updateData.short_description = data.short_description;
      if (data.main_prompt) updateData.main_prompt = data.main_prompt;
      if (data.user_guide !== undefined) updateData.user_guide = data.user_guide;
      // Handle tags separately using relations
      if (data.tags !== undefined) {
        // Delete existing tags
        await tx.promptTag.deleteMany({
          where: { prompt_id: id },
        });

        // Create new tags if provided
        if (data.tags && data.tags.length > 0) {
          const tagIds = await this.tagService.getOrCreateTags(data.tags, tx);
          for (const tagId of tagIds) {
            await tx.promptTag.create({
              data: {
                prompt_id: id,
                tag_id: tagId,
              },
            });
          }
        }
      }
      if (data.allow_comments !== undefined) updateData.allow_comments = data.allow_comments;
      if (data.published_date) updateData.published_date = parseDateField(data.published_date);
      if (data.published_time) updateData.published_time = data.published_time;
      if (data.moderation_status) updateData.moderation_status = data.moderation_status;

      const updatedPrompt = await tx.prompt.update({
        where: { id },
        data: updateData,
        include: {
          promptCategories: {
            include: {
              category: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
            },
          },
          promptTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // update embeddings
      const sourceText = `${data.title ?? ''} ${data.short_description ?? ''} ${data.main_prompt ?? ''}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at updatePrompt', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Prompt" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          id
        );
      }

      if (data.category_id) {
        const existingPC = await tx.promptCategory.findFirst({
          where: { prompt_id: id, category_id: data.category_id },
        });
        if (!existingPC) {
          await tx.promptCategory.create({
            data: {
              prompt_id: id,
              category_id: data.category_id,
              type: (data as any).type || 'Primary',
            },
          });
        } else if ((data as any).type && existingPC.type !== (data as any).type) {
          await tx.promptCategory.update({
            where: { id: existingPC.id },
            data: { type: (data as any).type },
          });
        }
      }

      // Validate categories exist and ensure only 3 total (1 primary + 2 secondary)
      const allCategoryIds: number[] = [];
      if (data.category_id) {
        allCategoryIds.push(data.category_id);
      }
      if (data.secondary_category_ids && Array.isArray(data.secondary_category_ids)) {
        allCategoryIds.push(...data.secondary_category_ids);
      }

      if (allCategoryIds.length > 3) {
        throw new Error('Maximum 3 categories allowed (1 primary + 2 secondary)');
      }

      if (allCategoryIds.length > 0) {
        await this.categoryService.validateCategoriesExist(allCategoryIds, Section.Prompt);
      }

      if (data.secondary_category_ids && Array.isArray(data.secondary_category_ids)) {
        await tx.promptCategory.deleteMany({
          where: { prompt_id: id, type: CategoryType.Secondary },
        });
        for (const secCatId of data.secondary_category_ids) {
          await tx.promptCategory.create({
            data: {
              prompt_id: id,
              category_id: secCatId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      // Log activity for status changes
      if (data.status === 'Published') {
        await this.activityService.logContentPublished(
          'Prompt',
          updatedPrompt.title,
          updatedPrompt.user_id
        );
      }
      // Note: is_featured is not available in update schema

      return updatedPrompt;
    });
  }

  async deletePrompt(id: number, user_id: number, isAdmin: boolean) {
    const isAuthorized = await PromptService.promptExists(id, isAdmin ? undefined : user_id);

    if (!isAuthorized) {
      throw new Error('Prompt not found');
    }

    return await prisma.$transaction(async (tx: any) => {
      const prompt = await tx.prompt.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!prompt) {
        throw new Error('Prompt not found');
      }

      // Delete related records first
      await tx.promptChain.deleteMany({
        where: { prompt_id: id },
      });

      await tx.promptTag.deleteMany({
        where: { prompt_id: id },
      });

      await tx.promptCategory.deleteMany({
        where: { prompt_id: id },
      });

      await tx.vote.deleteMany({
        where: { prompt_id: id },
      });

      // Delete the prompt
      const deletedPrompt = await tx.prompt.delete({
        where: { id },
      });

      // Log activity
      await this.activityService.logActivity({
        title: 'Prompt Deleted',
        description: `${prompt.title} deleted`,
        icon: '🗑️',
        user_id: user_id,
        reference_id: id,
        entity_type: 'prompt',
        entity_name: prompt.title,
      });

      return deletedPrompt;
    });
  }

  async bulkUpdatePromptStatus(
    data: {
      prompts: { id: number; moderation_status: ModerationStatus }[];
    },
    authenticatedUserId: number
  ) {
    const promptIds = data.prompts.map((p: any) => p.id);

    // First check if all prompts exist
    const existingPrompts = await this.prisma.prompt.findMany({
      where: {
        id: { in: promptIds },
      },
      select: {
        id: true,
        user_id: true,
        moderation_status: true,
      },
    });

    // Check for missing prompts first
    const foundIds = existingPrompts.map((p: any) => p.id);
    const missingIds = promptIds.filter((id: number) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new Error(`Prompts not found: ${missingIds.join(', ')}`);
    }

    // Proceed with updates in a transaction
    return await this.prisma.$transaction(async (tx: any) => {
      const results: any[] = [];
      const errors: { id: number; error: string }[] = [];
      let processed = 0;

      for (const promptUpdate of data.prompts) {
        try {
          const updateData: any = { moderation_status: promptUpdate.moderation_status };

          // Set published dates when approving
          if (promptUpdate.moderation_status === ModerationStatus.Approved) {
            updateData.published_date = parseDateField(new Date());
            updateData.published_time = new Date().toTimeString().slice(0, 5);
          }

          const updatedPrompt = await tx.prompt.update({
            where: { id: promptUpdate.id },
            data: updateData,
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          });

          // Log activity
          await this.activityService.logActivity({
            title: 'Prompt Status Updated',
            description: `Prompt "${updatedPrompt.title}" moderation status updated to ${promptUpdate.moderation_status}`,
            icon: '📝',
            user_id: authenticatedUserId,
            reference_id: promptUpdate.id,
            entity_type: 'prompt',
            entity_name: updatedPrompt.title,
          });

          results.push(updatedPrompt);
          processed++;
        } catch (err) {
          errors.push({
            id: promptUpdate.id,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }

      return {
        success: true,
        message: `Successfully updated ${processed} prompts${errors.length > 0 ? ` with ${errors.length} failures` : ''}`,
        data: {
          success: results,
          processed,
          failed: errors.length,
          errors,
        },
      };
    });
  }

  static async promptExists(id: number, user_id?: number): Promise<boolean> {
    const prompt = await prisma.prompt.findFirst({
      where: {
        id,
        ...(user_id !== undefined ? { user_id } : {}),
      },
      select: { id: true },
    });
    return !!prompt;
  }

  async bulkDeletePrompts(data: { promptIds: number[]; force?: boolean }) {
    const results: any[] = [];
    const errors: { id: number; error: string }[] = [];
    let processed = 0;

    // First check if all prompts exist
    const existingPrompts = await this.prisma.prompt.findMany({
      where: {
        id: { in: data.promptIds },
      },
      select: {
        id: true,
      },
    });

    // Check for missing prompts first
    const foundIds = existingPrompts.map((p: any) => p.id);
    const missingIds = data.promptIds.filter((id: number) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new Error(`Prompts not found: ${missingIds.join(', ')}`);
    }

    // Perform the deletions in a transaction
    return await this.prisma.$transaction(async (tx: any) => {
      for (const promptId of data.promptIds) {
        try {
          // Delete all related records first, regardless of force flag
          await tx.promptChain.deleteMany({
            where: { prompt_id: promptId },
          });

          await tx.promptTag.deleteMany({
            where: { prompt_id: promptId },
          });

          await tx.promptCategory.deleteMany({
            where: { prompt_id: promptId },
          });

          await tx.vote.deleteMany({
            where: { prompt_id: promptId },
          });

          // Delete the prompt
          const deletedPrompt = await tx.prompt.delete({
            where: { id: promptId },
          });

          results.push(deletedPrompt);
          processed++;
        } catch (err) {
          errors.push({ id: promptId, error: err instanceof Error ? err.message : String(err) });
        }
      }

      return {
        success: results.length > 0,
        processed,
        failed: errors.length,
        errors,
        message: `Successfully deleted ${processed} prompts${errors.length > 0 ? ` with ${errors.length} failures` : ''}`,
      };
    });
  }
}
