import { CategoryType } from '@prisma/client';
import type { Learning } from '@prisma/client';
import { z } from 'zod';
import {
  createLearningSchema,
  updateLearningSchema,
  bulkDeleteLearningsSchema,
  bulkUpdateLearningsSchema,
  getLearningsQuerySchema,
} from '../validators/learning.validator.ts';
import { prisma } from '../../../config/index.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { getEmbedding, parseDateField } from '../../../utils/utils.ts';

export class LearningService {
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

  async createLearning(data: z.infer<typeof createLearningSchema>, user_id: number) {
    return await this.prisma.$transaction(async (tx: any) => {
      const { category_ids, secondary_category_ids, tags, published_date, ...learningData } = data;

      // Validate categories exist
      const allCategoryIds: number[] = [];
      if (category_ids) {
        allCategoryIds.push(...category_ids);
      }
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        allCategoryIds.push(...secondary_category_ids);
      }
      if (allCategoryIds.length > 0) {
        await this.categoryService.validateCategoriesExist(allCategoryIds, 'Learning');
      }

      const publishedDate = parseDateField(published_date);

      // Create learning
      const createdLearning = await tx.learning.create({
        data: {
          ...learningData,
          user_id,
          published_date: publishedDate,
        },
      });

      const sourceText = `${learningData.title} ${learningData.description}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createLearning', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Learning" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          createdLearning.id
        );
      }

      // Create primary categories
      if (category_ids && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await tx.learningCategory.create({
            data: {
              learning_id: createdLearning.id,
              category_id: categoryId,
              type: CategoryType.Primary,
            },
          });
        }
      }

      // Create secondary categories
      if (secondary_category_ids && secondary_category_ids.length > 0) {
        for (const categoryId of secondary_category_ids) {
          await tx.learningCategory.create({
            data: {
              learning_id: createdLearning.id,
              category_id: categoryId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      if (tags && tags.length > 0) {
        const tagIds = await this.tagService.getOrCreateTags(tags, tx);
        for (const tagId of tagIds) {
          await tx.learningTag.create({
            data: {
              learning_id: createdLearning.id,
              tag_id: tagId,
            },
          });
        }
      }

      // Log activity
      await this.activityService.logContentCreated('Learning', createdLearning.title, user_id);

      return createdLearning;
    });
  }

  async getAllLearnings(query: z.infer<typeof getLearningsQuerySchema>, isAdmin: boolean = false) {
    const { page, limit, sort_by, ...filterQuery } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filterQuery.status) {
      where.status = filterQuery.status;
    }

    if (filterQuery.moderation_status) {
      where.moderation_status = filterQuery.moderation_status;
    }

    if (!isAdmin) {
      where.status = 'Published';
      where.moderation_status = 'Approved';
    }

    if (filterQuery.visibility) {
      where.visibility = filterQuery.visibility;
    }

    if (filterQuery.is_featured !== undefined) {
      where.is_featured = filterQuery.is_featured;
    }

    if (filterQuery.skill_level) {
      where.skill_level = filterQuery.skill_level;
    }

    if (filterQuery.category_id) {
      where.learningCategories = {
        some: {
          category_id: filterQuery.category_id,
          type: 'Primary',
        },
      };
    }

    if (filterQuery.user_id && isAdmin) {
      where.user_id = filterQuery.user_id;
    }

    if (filterQuery.search) {
      where.OR = [
        { title: { contains: filterQuery.search, mode: 'insensitive' } },
        { description: { contains: filterQuery.search, mode: 'insensitive' } },
        {
          learningTags: {
            some: {
              tag: {
                name: { contains: filterQuery.search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const [learnings, total] = await Promise.all([
      this.prisma.learning.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          learningCategories: {
            include: {
              category: true,
            },
          },
          learningTags: {
            include: {
              tag: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          id: sort_by === 'asc' ? 'asc' : 'desc',
        },
      }),
      this.prisma.learning.count({ where }),
    ]);

    return {
      learnings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getLearningById(id: number) {
    return await this.prisma.learning.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        learningCategories: {
          include: {
            category: true,
          },
        },
        learningTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async updateLearning(
    id: number,
    data: z.infer<typeof updateLearningSchema>,
    authenticatedUserId: number
  ): Promise<Learning> {
    return await this.prisma.$transaction(async (tx: any) => {
      const { category_ids, secondary_category_ids, tags, published_date, ...learningData } = data;

      // Validate categories exist if provided
      if (category_ids || secondary_category_ids) {
        const allCategoryIds: number[] = [];
        if (category_ids) {
          allCategoryIds.push(...category_ids);
        }
        if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
          allCategoryIds.push(...secondary_category_ids);
        }
        if (allCategoryIds.length > 0) {
          await this.categoryService.validateCategoriesExist(allCategoryIds, 'Learning');
        }
      }

      // Parse dates
      let publishedDate = null;
      if (published_date) {
        publishedDate = parseDateField(published_date);
      }

      // Update learning
      const updatedLearning = await tx.learning.update({
        where: { id },
        data: {
          ...learningData,
          published_date: publishedDate,
        },
      });

      if (learningData.title || learningData.description) {
        // update embeddings
        const sourceText = `${learningData.title ?? ''} ${learningData.description ?? ''}`;
        const embedding = await getEmbedding(sourceText).catch((err) => {
          console.log('error saving embeddings at updateLearning', err);
          return null;
        });
        if (embedding) {
          await tx.$executeRawUnsafe(
            `UPDATE "Learning" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            id
          );
        }
      }

      // Update categories if provided
      if (category_ids || secondary_category_ids) {
        // Delete existing categories
        await tx.learningCategory.deleteMany({
          where: { learning_id: id },
        });

        // Create primary categories
        if (category_ids && category_ids.length > 0) {
          for (const categoryId of category_ids) {
            await tx.learningCategory.create({
              data: {
                learning_id: id,
                category_id: categoryId,
                type: CategoryType.Primary,
              },
            });
          }
        }

        // Create secondary categories
        if (secondary_category_ids && secondary_category_ids.length > 0) {
          for (const categoryId of secondary_category_ids) {
            await tx.learningCategory.create({
              data: {
                learning_id: id,
                category_id: categoryId,
                type: CategoryType.Secondary,
              },
            });
          }
        }
      }

      // Update tags if provided
      if (tags !== undefined) {
        // Delete existing tags
        await tx.learningTag.deleteMany({
          where: { learning_id: id },
        });

        // Create new tags
        if (tags && tags.length > 0) {
          const tagIds = await this.tagService.getOrCreateTags(tags, tx);
          for (const tagId of tagIds) {
            await tx.learningTag.create({
              data: {
                learning_id: id,
                tag_id: tagId,
              },
            });
          }
        }
      }

      // Log activity for status changes
      if (data.status === 'Published') {
        await this.activityService.logContentPublished(
          'Learning',
          updatedLearning.title,
          authenticatedUserId
        );
      }
      if (data.is_featured === true) {
        await this.activityService.logActivity({
          title: 'Learning Featured',
          description: `${updatedLearning.title} featured`,
          icon: '⭐',
          user_id: authenticatedUserId,
          entity_type: 'learning',
          entity_name: updatedLearning.title,
        });
      }

      return updatedLearning;
    });
  }

  async deleteLearning(id: number, authenticatedUserId: number): Promise<Learning> {
    // Get learning info before deletion for activity logging
    const learning = await this.prisma.learning.findUnique({
      where: { id },
      select: { title: true, user_id: true },
    });

    if (!learning) {
      throw new Error('Learning resource not found');
    }

    const deletedLearning = await this.prisma.learning.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Learning Deleted',
      description: `${learning.title} deleted`,
      icon: '🗑️',
      user_id: authenticatedUserId,
      reference_id: id,
      entity_type: 'learning',
      entity_name: learning.title,
    });

    return deletedLearning;
  }

  async bulkDeleteLearnings(data: z.infer<typeof bulkDeleteLearningsSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const { learning_ids } = data;

      // Check if all learnings exist
      const existingLearnings = await tx.learning.findMany({
        where: {
          id: {
            in: learning_ids,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (existingLearnings.length !== learning_ids.length) {
        const foundIds = existingLearnings.map((learning: any) => learning.id);
        const missingIds = learning_ids.filter((id: number) => !foundIds.includes(id));
        throw new Error(`Learnings not found: ${missingIds.join(', ')}`);
      }

      // Delete learnings
      const deletedLearnings = await tx.learning.deleteMany({
        where: {
          id: {
            in: learning_ids,
          },
        },
      });

      return {
        deletedCount: deletedLearnings.count,
        deletedIds: learning_ids,
        learnings: existingLearnings,
      };
    });
  }

  async bulkUpdateLearnings(data: z.infer<typeof bulkUpdateLearningsSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const { learning_ids, ...updateData } = data;

      // Check if all learnings exist
      const existingLearnings = await tx.learning.findMany({
        where: {
          id: {
            in: learning_ids,
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (existingLearnings.length !== learning_ids.length) {
        const foundIds = existingLearnings.map((learning: any) => learning.id);
        const missingIds = learning_ids.filter((id: number) => !foundIds.includes(id));
        throw new Error(`Learnings not found: ${missingIds.join(', ')}`);
      }

      // Update learnings
      const updatedLearnings = await tx.learning.updateMany({
        where: {
          id: {
            in: learning_ids,
          },
        },
        data: updateData,
      });

      return {
        updatedCount: updatedLearnings.count,
        updatedIds: learning_ids,
        learnings: existingLearnings,
      };
    });
  }

  static async learningExists(id: number): Promise<boolean> {
    const learning = await prisma.learning.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!learning;
  }
}
