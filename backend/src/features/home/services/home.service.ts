import { z } from 'zod';
import { prisma } from '../../../config/index.ts';
import { getHomeDataSchema } from '../validators/home.validator.ts';
import { Prisma } from '@prisma/client';
import { addToolsRatings } from '../../../utils/rating.utils.ts';

export class HomeService {
  async getHomeData(query: z.infer<typeof getHomeDataSchema>) {
    const {
      resources = ['News', 'Article', 'Glossary', 'Tool', 'Learning'],
      limit = 10,
      sort_order = 'desc',
      is_featured,
      category_id,
      search,
    } = query;

    const results: any = {};

    // Fetch News
    if (resources.includes('News')) {
      results.news = await prisma.news.findMany({
        where: {
          ...(is_featured !== undefined && { is_featured }),
          status: 'Published',
          moderation_status: 'Approved',
          ...(category_id && {
            newsCategories: {
              some: {
                category_id: category_id,
              },
            },
          }),
          ...(search && {
            OR: [
              { headline: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }),
        },
        take: limit,
        orderBy: {
          id: sort_order,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
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

    // Fetch Articles
    if (resources.includes('Article')) {
      results.articles = await prisma.article.findMany({
        where: {
          ...(is_featured !== undefined && { is_featured }),
          status: 'Published',
          moderation_status: 'Approved',
          ...(category_id && {
            articleCategories: {
              some: {
                category_id: category_id,
              },
            },
          }),
          ...(search && {
            OR: [
              { headline: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }),
        },
        take: limit,
        orderBy: {
          id: sort_order,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
          articleCategories: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    // Fetch Glossary Terms
    if (resources.includes('Glossary')) {
      results.glossary = await prisma.glossaryTerm.findMany({
        where: {
          ...(is_featured !== undefined && { is_featured }),
          status: 'Published',
          moderation_status: 'Approved',
          ...(category_id && {
            glossary_categories: {
              some: {
                category_id: category_id,
              },
            },
          }),
          ...(search && {
            OR: [
              { term: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { definition: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }),
        },
        take: limit,
        orderBy: {
          id: sort_order,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
          glossary_categories: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    // Fetch Tools
    if (resources.includes('Tool')) {
      const tools = await prisma.tool.findMany({
        where: {
          ...(is_featured !== undefined && { is_featured }),
          status: 'Approved',
          ...(category_id && {
            tool_categories: {
              some: {
                category_id: category_id,
              },
            },
          }),
          ...(search && {
            OR: [{ name: { contains: search, mode: Prisma.QueryMode.insensitive } }],
          }),
        },
        take: limit,
        orderBy: {
          id: sort_order,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
          tool_categories: {
            include: {
              category: true,
            },
          },
          tool_tags: {
            include: {
              tag: true,
            },
          },
          reviews: {
            where: {
              status: 'Approved',
            },
            select: {
              overall_rating: true,
            },
          },
        },
      });

      // Calculate and add average ratings to tools
      results.tools = addToolsRatings(tools);
    }

    // Fetch Learning
    if (resources.includes('Learning')) {
      results.learning = await prisma.learning.findMany({
        where: {
          ...(is_featured !== undefined && { is_featured }),
          status: 'Published',
          moderation_status: 'Approved',
          ...(category_id && {
            learningCategories: {
              some: {
                category_id: category_id,
              },
            },
          }),
          ...(search && {
            OR: [
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }),
        },
        take: limit,
        orderBy: {
          id: sort_order,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
          learningCategories: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    return results;
  }

  async getPendingApprovals() {
    const [
      pendingTools,
      pendingToolClaims,
      pendingArticles,
      pendingGlossary,
      pendingPrompts,
      pendingLearning,
      pendingReviews,
    ] = await Promise.all([
      // Pending Tool Submissions
      prisma.tool.count({
        where: {
          status: 'Pending',
        },
      }),
      // Pending Tool Claims
      prisma.toolClaim.count({
        where: {
          status: 'Pending',
        },
      }),
      // Pending Article Reviews
      prisma.article.count({
        where: {
          moderation_status: 'Pending',
        },
      }),
      // Pending Glossary Reviews
      prisma.glossaryTerm.count({
        where: {
          moderation_status: 'Pending',
        },
      }),
      // Pending Prompt Reviews
      prisma.prompt.count({
        where: {
          moderation_status: 'Pending',
        },
      }),
      // Pending Learning Reviews
      prisma.learning.count({
        where: {
          moderation_status: 'Pending',
        },
      }),
      // Reviews that need moderation (Reported or Flagged)
      prisma.review.count({
        where: {
          status: {
            in: ['Reported', 'Flagged'],
          },
        },
      }),
    ]);

    return {
      toolSubmissions: pendingTools,
      toolClaims: pendingToolClaims,
      articleReviews: pendingArticles,
      glossaryReviews: pendingGlossary,
      promptReviews: pendingPrompts,
      learningReviews: pendingLearning,
      reviewModerations: pendingReviews,
      total:
        pendingTools +
        pendingToolClaims +
        pendingArticles +
        pendingGlossary +
        pendingPrompts +
        pendingLearning +
        pendingReviews,
    };
  }

  async getDashboardStats() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const [
      // Current counts
      totalUsers,
      totalTools,
      totalCategories,
      totalReviews,
      // Last month counts for comparison
      usersLastMonth,
      toolsLastMonth,
      categoriesLastMonth,
      reviewsLastMonth,
    ] = await Promise.all([
      // Current counts
      prisma.user.count({
        where: {
          status: 'Active',
        },
      }),
      prisma.tool.count({
        where: {
          status: 'Approved',
        },
      }),
      prisma.category.count(),
      prisma.review.count(),
      // Last month counts
      prisma.user.count({
        where: {
          created_at: {
            lte: lastMonth,
          },
        },
      }),
      prisma.tool.count({
        where: {
          status: 'Approved',
          created_at: {
            lte: lastMonth,
          },
        },
      }),
      prisma.category.count({
        where: {
          createdAt: {
            lte: lastMonth,
          },
        },
      }),
      prisma.review.count({
        where: {
          created_at: {
            lte: lastMonth,
          },
        },
      }),
    ]);

    // Calculate growth percentages
    const calculateGrowthPercentage = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    return {
      activeUsers: {
        count: totalUsers,
        growth: calculateGrowthPercentage(totalUsers, usersLastMonth),
      },
      totalTools: {
        count: totalTools,
        growth: calculateGrowthPercentage(totalTools, toolsLastMonth),
      },
      totalCategories: {
        count: totalCategories,
        growth: calculateGrowthPercentage(totalCategories, categoriesLastMonth),
      },
      reviews: {
        count: totalReviews,
        growth: calculateGrowthPercentage(totalReviews, reviewsLastMonth),
      },
    };
  }
}
