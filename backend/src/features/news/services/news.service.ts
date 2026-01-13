import { ArticleStatus, ModerationStatus, CategoryType } from '@prisma/client';
import type { News } from '@prisma/client';
import { z } from 'zod';
import {
  createNewsSchema,
  getNewsQuerySchema,
  updateNewsSchema,
  bulkDeleteNewsSchema,
} from '../validators/news.validator.ts';
import { prisma } from '../../../config/index.ts';
import { CategoryService } from '../../category/services/category.service.ts';
import { TagService } from '../../tag/services/tag.service.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';
import { getEmbedding, parseDateField } from '../../../utils/utils.ts';

export class NewsService {
  private categoryService: CategoryService;
  private tagService: TagService;
  private activityService: ActivityService;
  private prisma: any;

  constructor(categoryService: CategoryService, tagService: TagService, prisma?: any) {
    this.categoryService = categoryService;
    this.tagService = tagService;
    this.activityService = new ActivityService();
    this.prisma = prisma || prisma;
  }

  async createNews(data: z.infer<typeof createNewsSchema>, user_id: number) {
    return await this.prisma.$transaction(async (tx: any) => {
      const {
        category_ids,
        secondary_category_ids,
        tags,
        published_date,
        published_time,
        ...newsData
      } = data;

      // Validate categories exist
      const allCategoryIds: number[] = [];
      if (category_ids) {
        allCategoryIds.push(...category_ids);
      }
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        allCategoryIds.push(...secondary_category_ids);
      }

      if (allCategoryIds.length > 3) {
        throw new Error('Maximum 3 categories allowed (1 primary + 2 secondary)');
      }

      if (allCategoryIds.length > 0) {
        await this.categoryService.validateCategoriesExist(allCategoryIds, 'News');
      }

      // Get or create tags
      const tagIds = tags?.length ? await this.tagService.getOrCreateTags(tags, tx) : [];

      const createdNews = await tx.news.create({
        data: {
          ...newsData,
          user_id,
          published_date: parseDateField(published_date),
          published_time: published_time,
          ...(tagIds.length && {
            newsTags: {
              create: tagIds.map((tagId: number) => ({ tag_id: tagId })),
            },
          }),
        },
      });

      const sourceText = `${newsData.headline} ${newsData.content}`;
      const embedding = await getEmbedding(sourceText).catch((err) => {
        console.log('error saving embeddings at createNews', err);
        return null;
      });
      if (embedding) {
        await tx.$executeRawUnsafe(
          `UPDATE "News" SET embedding = $1::vector WHERE id = $2`,
          embedding,
          createdNews.id
        );
      }

      // Create primary categories
      if (category_ids && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await tx.newsCategory.create({
            data: {
              news_id: createdNews.id,
              category_id: categoryId,
              type: CategoryType.Primary,
            },
          });
        }
      }

      // Create secondary categories
      if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
        for (const secCatId of secondary_category_ids) {
          await tx.newsCategory.create({
            data: {
              news_id: createdNews.id,
              category_id: secCatId,
              type: CategoryType.Secondary,
            },
          });
        }
      }

      // Log activity
      await this.activityService.logContentCreated('News', createdNews.headline, user_id);

      return createdNews;
    });
  }

  async getNewsById(id: number, isAdmin: boolean = false) {
    const where: any = { id };

    if (!isAdmin) {
      where.status = ArticleStatus.Published;
      where.moderation_status = ModerationStatus.Approved;
    }

    return await this.prisma.news.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
        newsTags: {
          include: {
            tag: true,
          },
        },
        newsCategories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getAllNews(query: z.infer<typeof getNewsQuerySchema>, isAdmin: boolean = false) {
    const {
      page = 1,
      limit = 10,
      status,
      moderation_status,
      visibility,
      is_featured,
      search,
      user_id,
      category_ids,
      tags,
      sort_by = 'desc',
      sort_field = 'published_date',
    } = query;

    const where: any = {};

    if (!isAdmin) {
      where.status = ArticleStatus.Published;

      where.moderation_status = ModerationStatus.Approved;
    } else {
      if (status) where.status = status;
      if (moderation_status) where.moderation_status = moderation_status;
      if (visibility) where.visibility = visibility;
    }

    if (is_featured !== undefined) where.is_featured = is_featured;
    if (user_id) where.user_id = user_id;

    if (search) {
      where.OR = [
        { headline: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { seo_title: { contains: search, mode: 'insensitive' } },
        {
          newsTags: {
            some: {
              tag: {
                name: { contains: search, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const orderBy: any = {};
    orderBy[sort_field] = sort_by;

    const skip = (page - 1) * limit;

    const [news, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
          newsTags: {
            include: {
              tag: true,
            },
          },
          newsCategories: {
            include: {
              category: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.news.count({ where }),
    ]);

    // Filter by categories if provided
    let filteredNews = news;
    if (category_ids && category_ids.length > 0) {
      filteredNews = news.filter((item: any) =>
        item.newsCategories.some((nc: any) => category_ids.includes(nc.category_id))
      );
    }

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      filteredNews = filteredNews.filter((item: any) =>
        item.newsTags.some((nt: any) => tags.includes(nt.tag.name))
      );
    }

    return {
      news: filteredNews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async updateNews(
    id: number,
    data: z.infer<typeof updateNewsSchema>,
    authenticatedUserId: number
  ): Promise<News> {
    return await this.prisma.$transaction(async (tx: any) => {
      const {
        category_ids,
        secondary_category_ids,
        tags,
        published_date,
        published_time,
        ...newsData
      } = data;

      // Validate categories exist if provided
      if (category_ids || secondary_category_ids) {
        const allCategoryIds: number[] = [];
        if (category_ids) {
          allCategoryIds.push(...category_ids);
        }
        if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
          allCategoryIds.push(...secondary_category_ids);
        }

        if (allCategoryIds.length > 3) {
          throw new Error('Maximum 3 categories allowed (1 primary + 2 secondary)');
        }

        if (allCategoryIds.length > 0) {
          await this.categoryService.validateCategoriesExist(allCategoryIds, 'News');
        }
      }

      // Update tags
      if (tags !== undefined) {
        // Remove existing tags
        await tx.newsTag.deleteMany({
          where: { news_id: id },
        });

        // Add new tags
        if (tags && tags.length > 0) {
          const tagIds = await this.tagService.getOrCreateTags(tags, tx);
          await tx.newsTag.createMany({
            data: tagIds.map((tagId: number) => ({
              news_id: id,
              tag_id: tagId,
            })),
          });
        }
      }

      // Update categories if provided
      if (category_ids || secondary_category_ids) {
        // Delete existing categories
        await tx.newsCategory.deleteMany({
          where: { news_id: id },
        });

        // Create primary categories
        if (category_ids && category_ids.length > 0) {
          for (const categoryId of category_ids) {
            await tx.newsCategory.create({
              data: {
                news_id: id,
                category_id: categoryId,
                type: CategoryType.Primary,
              },
            });
          }
        }

        // Create secondary categories
        if (secondary_category_ids && Array.isArray(secondary_category_ids)) {
          for (const secCatId of secondary_category_ids) {
            await tx.newsCategory.create({
              data: {
                news_id: id,
                category_id: secCatId,
                type: CategoryType.Secondary,
              },
            });
          }
        }
      }

      const updateData: any = {
        ...newsData,
      };

      if (published_date !== undefined) {
        updateData.published_date = parseDateField(published_date);
      }

      if (published_time !== undefined) {
        updateData.published_time = published_time;
      }

      const updatedNews = await tx.news.update({
        where: { id },
        data: updateData,
      });

      // Log activity for status changes
      if (data.status === 'Published') {
        await this.activityService.logContentPublished(
          'News',
          updatedNews.headline,
          authenticatedUserId
        );
      }
      if (data.is_featured === true) {
        await this.activityService.logActivity({
          title: 'News Featured',
          description: `${updatedNews.headline} featured`,
          icon: '⭐',
          user_id: authenticatedUserId,
          entity_type: 'news',
          entity_name: updatedNews.headline,
        });
      }
      if (newsData.headline && newsData.content) {
        // update embeddings
        const sourceText = `${newsData.headline ?? ''} ${newsData.content ?? ''}`;
        const embedding = await getEmbedding(sourceText).catch((err) => {
          console.log('error saving embeddings at updateNews', err);
          return null;
        });
        if (embedding) {
          await tx.$executeRawUnsafe(
            `UPDATE "News" SET embedding = $1::vector WHERE id = $2`,
            embedding,
            id
          );
        }
      }
      return updatedNews;
    });
  }

  async deleteNews(id: number, authenticatedUserId: number): Promise<News> {
    return await this.prisma.$transaction(async (tx: any) => {
      // Get news info before deletion for activity logging
      const news = await tx.news.findUnique({
        where: { id },
        select: { headline: true, user_id: true },
      });

      if (!news) {
        throw new Error('News article not found');
      }

      // Delete related NewsTag records first
      await tx.newsTag.deleteMany({
        where: { news_id: id },
      });

      // Delete related NewsCategory records first
      await tx.newsCategory.deleteMany({
        where: { news_id: id },
      });

      // Now delete the news
      const deletedNews = await tx.news.delete({
        where: { id },
      });

      // Log activity
      await this.activityService.logActivity({
        title: 'News Deleted',
        description: `${news.headline} deleted`,
        icon: '🗑️',
        user_id: authenticatedUserId,
        reference_id: id,
        entity_type: 'news',
        entity_name: news.headline,
      });

      return deletedNews;
    });
  }

  async bulkDeleteNews(
    data: z.infer<typeof bulkDeleteNewsSchema>
  ): Promise<{ deletedCount: number; deletedIds: number[] }> {
    const { news_ids } = data;

    return await this.prisma.$transaction(async (tx: any) => {
      // Delete related NewsTag records first
      await tx.newsTag.deleteMany({
        where: {
          news_id: {
            in: news_ids,
          },
        },
      });

      // Delete related NewsCategory records first
      await tx.newsCategory.deleteMany({
        where: {
          news_id: {
            in: news_ids,
          },
        },
      });

      // Now delete the news items
      const result = await tx.news.deleteMany({
        where: {
          id: {
            in: news_ids,
          },
        },
      });

      return {
        deletedCount: result.count,
        deletedIds: news_ids,
      };
    });
  }

  async bulkUpdateNewsModerationStatus(
    news_ids: number[],
    moderation_status: ModerationStatus,
    authenticatedUserId: number
  ) {
    return await this.prisma.$transaction(async (tx: any) => {
      const existingNews = await tx.news.findMany({
        where: { id: { in: news_ids } },
      });

      if (existingNews.length !== news_ids.length) {
        const foundIds = existingNews.map((news: any) => news.id);
        const missingIds = news_ids.filter((id) => !foundIds.includes(id));
        throw new Error(`News not found: ${missingIds.join(', ')}`);
      }

      await tx.news.updateMany({
        where: { id: { in: news_ids } },
        data: { moderation_status },
      });

      // Log activity for each news item
      for (const news of existingNews) {
        await this.activityService.logActivity({
          title: 'News Moderation Status Updated',
          description: `News "${news.headline}" moderation status updated to ${moderation_status}`,
          icon: '📝',
          user_id: authenticatedUserId,
          reference_id: news.id,
          entity_type: 'news',
          entity_name: news.headline,
        });
      }

      const updatedNewsList = await tx.news.findMany({
        where: { id: { in: news_ids } },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
          newsTags: {
            include: {
              tag: true,
            },
          },
          newsCategories: {
            include: {
              category: true,
            },
          },
        },
      });

      return updatedNewsList;
    });
  }

  async updateNewsModerationStatus(
    id: number,
    moderation_status: ModerationStatus,
    authenticatedUserId: number
  ): Promise<News> {
    const news = await this.prisma.news.update({
      where: { id },
      data: { moderation_status },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'News Moderation Status Updated',
      description: `News "${news.headline}" moderation status updated to ${moderation_status}`,
      icon: '📝',
      user_id: authenticatedUserId,
      reference_id: id,
      entity_type: 'news',
      entity_name: news.headline,
    });

    return news;
  }

  static async newsExists(id: number): Promise<boolean> {
    const news = await prisma.news.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!news;
  }
}
