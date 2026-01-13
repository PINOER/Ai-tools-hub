import { PrismaClient, Comment, CommentStatus } from '@prisma/client';
import {
  CreateCommentInput,
  UpdateCommentInput,
  UpdateCommentStatusInput,
  GetCommentsInput,
} from '../validators/comment.validator.ts';
import { verifyTargetExists } from '@utils/utils.ts';
import { ActivityService } from '../../activity/services/activity.service.ts';

export class CommentService {
  private activityService: ActivityService;

  constructor(private prisma: PrismaClient) {
    this.activityService = new ActivityService();
  }

  async createComment(data: CreateCommentInput, userId: number): Promise<Comment> {
    // Verify target exists before creating comment
    const targetExists = await verifyTargetExists(data.content_id, data.content_type);
    if (!targetExists) {
      throw new Error(`${data.content_type} with ID ${data.content_id} does not exist`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        content_type: data.content_type,
        content_id: data.content_id,
        user_id: userId,
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
      },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Comment Created',
      description: `Comment created on ${data.content_type}`,
      icon: '💬',
      user_id: userId,
      reference_id: data.content_id,
      entity_type: data.content_type.toLowerCase(),
      entity_name: `${data.content_type} Comment`,
    });

    return comment;
  }

  async getComments(
    params: GetCommentsInput,
    isAdmin: boolean
  ): Promise<{ comments: Comment[]; total: number }> {
    const { content_type, content_id, page, limit, status, user_id } = params;
    const skip = (page - 1) * limit;

    const whereClause: any = { status };
    if (content_type) whereClause.content_type = content_type;
    if (content_id) whereClause.content_id = content_id;
    if (user_id) whereClause.user_id = user_id;
    if (!isAdmin) whereClause.status = CommentStatus.APPROVED;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: whereClause,
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
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({
        where: whereClause,
      }),
    ]);

    return { comments, total };
  }

  async getCommentById(id: number): Promise<Comment | null> {
    return this.prisma.comment.findUnique({
      where: { id },
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
      },
    });
  }

  async updateComment(id: number, data: UpdateCommentInput, userId: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.user_id !== userId) {
      throw new Error('Unauthorized to update this comment');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
        updated_at: new Date(),
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
      },
    });
  }

  async updateCommentStatus(
    id: number,
    data: UpdateCommentStatusInput,
    userId: number
  ): Promise<Comment> {
    const comment = await this.prisma.comment.update({
      where: { id },
      data: {
        status: data.status,
        updated_at: new Date(),
      },
    });

    // Log activity for status changes
    if (data.status === CommentStatus.APPROVED) {
      await this.activityService.logActivity({
        title: 'Comment Approved',
        description: `Comment approved on ${comment.content_type}`,
        icon: '✅',
        user_id: userId,
        reference_id: comment.content_id || undefined,
        entity_type: comment.content_type.toLowerCase(),
        entity_name: `${comment.content_type} Comment`,
      });
    } else if (data.status === CommentStatus.REJECTED) {
      await this.activityService.logActivity({
        title: 'Comment Rejected',
        description: `Comment rejected on ${comment.content_type}`,
        icon: '❌',
        user_id: userId,
        reference_id: comment.content_id || undefined,
        entity_type: comment.content_type.toLowerCase(),
        entity_name: `${comment.content_type} Comment`,
      });
    }

    return comment;
  }

  async deleteComment(id: number, userId: number, authenticatedUserId: number): Promise<void> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.user_id !== userId) {
      throw new Error('Unauthorized to delete this comment');
    }

    await this.prisma.comment.delete({
      where: { id },
    });

    // Log activity
    await this.activityService.logActivity({
      title: 'Comment Deleted',
      description: `Comment deleted on ${comment.content_type}`,
      icon: '🗑️',
      user_id: authenticatedUserId,
      reference_id: comment.content_id || undefined,
      entity_type: comment.content_type.toLowerCase(),
      entity_name: `${comment.content_type} Comment`,
    });
  }
}
