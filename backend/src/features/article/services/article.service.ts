import { ArticleStatus, CategoryType, ModerationStatus } from '@prisma/client';
import type { Article } from '@prisma/client';
import { z } from 'zod';
import {
  createArticleSchema,
  updateArticleSchema,
  bulkDeleteArticlesSchema,
  bulkUpdateArticlesSchema,
  getArticlesQuerySchema,
} from '../validators/article.validator.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { getEmbedding, parseDateField } from '../../../utils/utils.ts';
import { prisma } from '../../../config/index.ts';

export class ArticleService {
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

  async createArticle(data: z.infer<typeof createArticleSchema>, user_id: number) {
    return await this.prisma.$transaction(async (tx: any) => {
      const {
        category_ids,
        secondary_category_ids,
        tags,
        published_date,
        published_time,
        ...articleData
      } = data;

      // Validate categories exist
      const allCategoryIds: number[] = [];
      if (category_ids) {
        allCategoryIds.push(...category_ids);
      }
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        allCategoryIds.push(...secondary_category_ids);
      }
      if (allCategoryIds.length > 0) {
        await this.categoryService.validateCategoriesExist(allCategoryIds, 'Article');
      }

      // Parse dates
      let publishedDate = null;
      if (published_date && published_time) {
        publishedDate = parseDateField(`${published_date}T${published_time}`);
      } else if (published_date) {
        publishedDate = parseDateField(published_date);
      }

      // Create article
      const createdArticle = await tx.article.create({
        data: {
          ...articleData,
          user_id,
          published_date: publishedDate,
        },
      });

      const sourceText = `${articleData.headline} ${articleData.content}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createArticle', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "Article" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          createdArticle.id
        );
      }

      // Create primary categories
      if (category_ids && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await tx.articleCategory.create({
            data: {
              article_id: createdArticle.id,
              category_id: categoryId,
              type: CategoryType.Primary,
            },
          });
        }
      }

      // Create secondary categories
      if (secondary_category_ids && secondary_category_ids.length > 0) {
        for (const categoryId of secondary_category_ids) {
          await tx.articleCategory.create({
            data: {
              article_id: createdArticle.id,
              category_id: categoryId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      // Create tags if provided
      if (tags && tags.length > 0) {
        const tagIds = await this.tagService.getOrCreateTags(tags, tx);
        for (const tagId of tagIds) {
          await tx.articleTag.create({
            data: {
              article_id: createdArticle.id,
              tag_id: tagId,
            },
          });
        }
      }

      // Log activity
      await this.activityService.logContentCreated('Article', createdArticle.headline, user_id);

      return createdArticle;
    });
  }

  async getArticles(query: z.infer<typeof getArticlesQuerySchema>, isAdmin: boolean = false) {
    const { page, limit, sort_by, ...filterQuery } = query;
    const skip = (page - 1) * limit;
    let orderBy: any = {};
    if (sort_by) {
      orderBy = {
        headline: sort_by,
      };
    } else {
      orderBy = {
        published_date: 'desc',
      };
    }

    const where: any = {};

    if (filterQuery.status) {
      where.status = filterQuery.status;
    }

    if (filterQuery.moderation_status) {
      where.moderation_status = filterQuery.moderation_status;
    }

    if (!isAdmin) {
      where.status = ArticleStatus.Published;
      where.moderation_status = ModerationStatus.Approved;
    }

    if (filterQuery.visibility) {
      where.visibility = filterQuery.visibility;
    }

    if (filterQuery.is_featured !== undefined) {
      where.is_featured = filterQuery.is_featured;
    }

    if (filterQuery.category_id) {
      where.articleCategories = {
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
        { headline: { contains: filterQuery.search, mode: 'insensitive' } },
        { content: { contains: filterQuery.search, mode: 'insensitive' } },
        {
          articleTags: {
            some: {
              tag: {
                name: { contains: filterQuery.search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          articleCategories: {
            include: {
              category: true,
            },
          },
          articleTags: {
            include: {
              tag: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getArticleById(id: number) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        articleCategories: {
          include: {
            category: true,
          },
        },
        articleTags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async updateArticle(
    id: number,
    data: z.infer<typeof updateArticleSchema>,
    authenticatedUserId: number
  ): Promise<Article> {
    return await this.prisma.$transaction(async (tx: any) => {
      const { category_ids, secondary_category_ids, tags, published_date, ...articleData } = data;

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
          await this.categoryService.validateCategoriesExist(allCategoryIds, 'Article');
        }
      }

      // Parse dates
      let publishedDate = null;
      if (published_date) {
        publishedDate = parseDateField(`${published_date}`);
      }
      // Update article
      const updatedArticle = await tx.article.update({
        where: { id },
        data: {
          ...articleData,
          published_date: publishedDate,
        },
      });

      if (articleData.headline || articleData.content) {
        // update embeddings
        const sourceText = `${articleData.headline ?? ''} ${articleData.content ?? ''}`;
        const embedding = await getEmbedding(sourceText).catch((err) => {
          console.log('error saving embeddings at updateArticle', err);
          return null;
        });
        if (embedding) {
          await tx.$executeRawUnsafe(
            `UPDATE "Article" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            id
          );
        }
      }

      // Update categories if provided
      if (category_ids || secondary_category_ids) {
        // Delete existing categories
        await tx.articleCategory.deleteMany({
          where: { article_id: id },
        });

        // Create primary categories
        if (category_ids && category_ids.length > 0) {
          for (const categoryId of category_ids) {
            await tx.articleCategory.create({
              data: {
                article_id: id,
                category_id: categoryId,
                type: CategoryType.Primary,
              },
            });
          }
        }

        // Create secondary categories
        if (secondary_category_ids && secondary_category_ids.length > 0) {
          for (const categoryId of secondary_category_ids) {
            await tx.articleCategory.create({
              data: {
                article_id: id,
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
        await tx.articleTag.deleteMany({
          where: { article_id: id },
        });

        // Create new tags
        if (tags && tags.length > 0) {
          const tagIds = await this.tagService.getOrCreateTags(tags, tx);
          for (const tagId of tagIds) {
            await tx.articleTag.create({
              data: {
                article_id: id,
                tag_id: tagId,
              },
            });
          }
        }
      }

      // Log activity for status changes
      if (data.status === 'Published') {
        await this.activityService.logContentPublished(
          'Article',
          updatedArticle.headline,
          authenticatedUserId
        );
      }
      if (data.is_featured === true) {
        await this.activityService.logActivity({
          title: 'Article Featured',
          description: `${updatedArticle.headline} featured`,
          icon: '⭐',
          user_id: authenticatedUserId,
          entity_type: 'article',
          entity_name: updatedArticle.headline,
        });
      }

      return updatedArticle;
    });
  }

  async deleteArticle(id: number, user_id: number): Promise<Article> {
    // Get article info before deletion for activity logging
    const article = await this.prisma.article.findUnique({
      where: { id },
      select: { headline: true, user_id: true },
    });

    if (!article) {
      throw new Error('Article not found');
    }

    const deletedArticle = await this.prisma.article.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Article Deleted',
      description: `${article.headline} deleted`,
      icon: '🗑️',
      user_id: user_id,
      reference_id: id,
      entity_type: 'article',
      entity_name: article.headline,
    });

    return deletedArticle;
  }

  async bulkDeleteArticles(data: z.infer<typeof bulkDeleteArticlesSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const { article_ids } = data;

      // Check if all articles exist
      const existingArticles = await tx.article.findMany({
        where: {
          id: {
            in: article_ids,
          },
        },
        select: {
          id: true,
          headline: true,
        },
      });

      if (existingArticles.length !== article_ids.length) {
        const foundIds = existingArticles.map((article: any) => article.id);
        const missingIds = article_ids.filter((id) => !foundIds.includes(id));
        throw new Error(`Articles not found: ${missingIds.join(', ')}`);
      }

      // Delete articles
      const deletedArticles = await tx.article.deleteMany({
        where: {
          id: {
            in: article_ids,
          },
        },
      });

      return {
        deletedCount: deletedArticles.count,
        deletedIds: article_ids,
        articles: existingArticles,
      };
    });
  }

  async bulkUpdateArticles(data: z.infer<typeof bulkUpdateArticlesSchema>) {
    return await this.prisma.$transaction(async (tx: any) => {
      const { article_ids, ...updateData } = data;

      // Check if all articles exist
      const existingArticles = await tx.article.findMany({
        where: {
          id: {
            in: article_ids,
          },
        },
        select: {
          id: true,
          headline: true,
        },
      });

      if (existingArticles.length !== article_ids.length) {
        const foundIds = existingArticles.map((article: any) => article.id);
        const missingIds = article_ids.filter((id) => !foundIds.includes(id));
        throw new Error(`Articles not found: ${missingIds.join(', ')}`);
      }

      // Update articles
      const updatedArticles = await tx.article.updateMany({
        where: {
          id: {
            in: article_ids,
          },
        },
        data: updateData,
      });

      return {
        updatedCount: updatedArticles.count,
        updatedIds: article_ids,
        articles: existingArticles,
      };
    });
  }

  static async articleExists(id: number): Promise<boolean> {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!article;
  }
}
