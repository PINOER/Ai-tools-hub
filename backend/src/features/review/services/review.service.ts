import { z } from 'zod';
import { prisma } from '../../../config/index.ts';
import {
  markHelpfulSchema,
  reportReviewSchema,
  updateReviewSchema,
} from '../validators/review.validator.ts';
import { ReviewStatus } from '@prisma/client';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class ReviewService {
  private activityService: ActivityService;

  constructor() {
    this.activityService = new ActivityService();
  }
  async create(userId: number, data: any) {
    const { tool_id, overall_rating, comment, criteria } = data;

    // Get tool name for activity logging
    const tool = await prisma.tool.findUnique({
      where: { id: tool_id },
      select: { name: true },
    });

    const review = await prisma.review.create({
      data: {
        user_id: userId,
        tool_id,
        overall_rating,
        comment,
        criteria: {
          create: criteria.map((c: any) => ({
            name: c.name,
            rating: c.rating,
            comment: c.comment,
          })),
        },
      },
      include: { criteria: true },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Review Created',
      description: `Review created for ${tool?.name || 'Unknown Tool'}`,
      icon: '⭐',
      user_id: userId,
      reference_id: tool_id,
      entity_type: 'tool',
      entity_name: tool?.name || 'Unknown Tool',
    });

    return review;
  }

  async deleteReview(reviewId: number, authenticatedUserId: number) {
    const review = await this.findReviewById(reviewId);

    // Get tool name for activity logging
    const tool = await prisma.tool.findUnique({
      where: { id: review.tool_id },
      select: { name: true },
    });

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Review Deleted',
      description: `Review deleted for ${tool?.name || 'Unknown Tool'}`,
      icon: '🗑️',
      user_id: authenticatedUserId,
      reference_id: review.tool_id,
      entity_type: 'tool',
      entity_name: tool?.name || 'Unknown Tool',
    });
  }

  async getReviews(
    query: {
      page?: number;
      limit?: number;
      tool_id?: number;
      user_id?: number;
      status?: string;
      sort_by?: 'recent' | 'rating' | 'helpful';
      search?: string;
    },
    isAdmin: boolean = false
  ) {
    const { page = 1, limit = 10, tool_id, user_id, status, sort_by, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (tool_id) {
      where.tool_id = tool_id;
    }

    // For non-admin users, only show approved reviews
    if (!isAdmin) {
      where.status = 'Approved';
    } else if (status) {
      where.status = status;
    }

    if (user_id) {
      where.user_id = user_id;
    }

    // Add search functionality for tool name and user name
    if (search) {
      where.OR = [
        {
          tool: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          user: {
            OR: [
              {
                first_name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ];
    }

    // Default sorting
    let orderBy: any = { created_at: 'desc' };

    if (sort_by === 'rating') {
      orderBy = { overall_rating: 'desc' };
    }

    if (sort_by === 'helpful') {
      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                avatar: true,
              },
            },
            helpful_votes: true,
            tool: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: [
            {
              helpful_votes: {
                _count: 'desc',
              },
            },
            {
              created_at: 'desc',
            },
          ],
        }),
        prisma.review.count({ where }),
      ]);

      return {
        reviews,
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

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              avatar: true,
            },
          },
          helpful_votes: true,
          tool: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      reviews,
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

  async markHelpful(userId: number, data: z.infer<typeof markHelpfulSchema>): Promise<void> {
    const alreadyVoted = await this.hasUserVotedHelpful(userId, data.review_id);
    if (!alreadyVoted) {
      await prisma.reviewHelpfulVote.create({
        data: {
          user_id: userId,
          review_id: data.review_id,
        },
      });
    }
  }

  async findReviewById(reviewId: number) {
    const existing = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!existing) {
      const error = new Error('Review not found');
      (error as any).status = 404;
      throw error;
    }
    return existing;
  }

  async updateStatus(reviewId: number, user_id: number, data: z.infer<typeof updateReviewSchema>) {
    const { status, remarks } = data;
    const review = await this.findReviewById(reviewId);

    // Get tool name for activity logging
    const tool = await prisma.tool.findUnique({
      where: { id: review.tool_id },
      select: { name: true },
    });

    await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    await prisma.reviewModeration.create({
      data: {
        review_id: reviewId,
        moderator_id: user_id,
        remarks,
      },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Review Status Updated',
      description: `Review status updated to ${status} for ${tool?.name || 'Unknown Tool'}`,
      icon: '📝',
      user_id: user_id,
      reference_id: review.tool_id,
      entity_type: 'tool',
      entity_name: tool?.name || 'Unknown Tool',
    });
  }

  async hasUserVotedHelpful(userId: number, reviewId: number): Promise<boolean> {
    const vote = await prisma.reviewHelpfulVote.findUnique({
      where: {
        user_id_review_id: {
          user_id: userId,
          review_id: reviewId,
        },
      },
    });

    return !!vote;
  }

  async report(userId: number, data: z.infer<typeof reportReviewSchema>) {
    await prisma.reviewReport.create({
      data: { user_id: userId, ...data },
    });
  }

  async getReportsForTool(toolId: number) {
    return prisma.reviewReport.findMany({
      where: {
        review: {
          tool_id: toolId,
        },
      },
      include: {
        user: true, // who reported
        review: {
          include: {
            user: true, // author of the review
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async deleteReport(reportId: number) {
    const existing = await prisma.reviewReport.findUnique({
      where: { id: reportId },
    });

    if (!existing) {
      const error = new Error('Report not found');
      (error as any).status = 404;
      throw error;
    }

    await prisma.reviewReport.delete({
      where: { id: reportId },
    });
  }

  async bulkUpdateStatus(
    reviews: { id: number; status: ReviewStatus }[],
    authenticatedUserId: number
  ) {
    const results = [];
    for (const { id, status } of reviews) {
      try {
        const review = await this.findReviewById(id);
        await prisma.review.update({ where: { id }, data: { status } });

        // Get tool name for activity logging
        const tool = await prisma.tool.findUnique({
          where: { id: review.tool_id },
          select: { name: true },
        });

        // Log activity for status changes
        if (status === ReviewStatus.Approved) {
          await this.activityService.logActivity({
            title: 'Review Approved',
            description: `Review approved for ${tool?.name || 'Unknown Tool'}`,
            icon: '✅',
            user_id: authenticatedUserId,
            reference_id: review.tool_id,
            entity_type: 'tool',
            entity_name: 'Review',
          });
        } else if (status === ReviewStatus.Reported) {
          await this.activityService.logActivity({
            title: 'Review Rejected',
            description: `Review rejected for ${tool?.name || 'Unknown Tool'}`,
            icon: '❌',
            user_id: authenticatedUserId,
            reference_id: review.tool_id,
            entity_type: 'tool',
            entity_name: 'Review',
          });
        }

        results.push({ id, status: 'updated' });
      } catch (error) {
        results.push({ id, error: (error as Error).message });
      }
    }
    return results;
  }

  async bulkDelete(ids: number[]) {
    const results = [];
    for (const id of ids) {
      try {
        await this.findReviewById(id);
        await prisma.review.delete({ where: { id } });
        results.push({ id, status: 'deleted' });
      } catch (error) {
        results.push({ id, error: (error as Error).message });
      }
    }
    return results;
  }
}
