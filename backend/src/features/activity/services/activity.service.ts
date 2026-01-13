import { prisma } from '../../../config/index.ts';

export interface CreateActivityData {
  title: string;
  description: string;
  icon?: string;
  user_id: number; // Required - must be authenticated user
  reference_id?: number;
  entity_type?: string;
  entity_name?: string;
  metadata?: any;
}

export interface ActivityFeedItem {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
  user_id?: number | null;
  reference_id?: number | null;
  entity_type?: string | null;
  entity_name?: string | null;
  metadata?: any;
  created_at: Date;
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  timeAgo: string;
}

export class ActivityService {
  async logActivity(data: CreateActivityData) {
    // Validate that the user exists before logging activity
    const user = await prisma.user.findUnique({
      where: { id: data.user_id },
      select: { id: true },
    });

    if (!user) {
      console.warn(`Activity logging skipped: User with ID ${data.user_id} not found`);
      return null;
    }

    return await prisma.activityLog.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        user_id: data.user_id,
        reference_id: data.reference_id,
        entity_type: data.entity_type,
        entity_name: data.entity_name,
        metadata: data.metadata,
      },
    });
  }

  async getActivityFeed(page: number = 1, limit: number = 50, entityType?: string) {
    const skip = (page - 1) * limit;

    const where = entityType ? { entity_type: entityType } : {};

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
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
      prisma.activityLog.count({ where }),
    ]);

    const formattedActivities: ActivityFeedItem[] = activities.map((activity) => ({
      ...activity,
      timeAgo: this.getTimeAgo(activity.created_at),
    }));

    return {
      activities: formattedActivities,
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

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  }

  // Helper methods for common activities
  async logToolSubmission(toolName: string, userId: number) {
    return this.logActivity({
      title: 'New Tool Submission',
      description: `${toolName} submitted for review`,
      icon: '🛠️',
      user_id: userId,
      entity_type: 'tool',
      entity_name: toolName,
    });
  }

  async logToolApproval(toolName: string, userId: number) {
    return this.logActivity({
      title: 'Tool Approved',
      description: `${toolName} approved`,
      icon: '✅',
      user_id: userId,
      entity_type: 'tool',
      entity_name: toolName,
    });
  }

  async logReviewCompleted(toolName: string, userId: number) {
    return this.logActivity({
      title: 'Review Completed',
      description: `${toolName} review completed`,
      icon: '⭐',
      user_id: userId,
      entity_type: 'tool',
      entity_name: toolName,
    });
  }

  async logClaimApproved(toolName: string, userId: number) {
    return this.logActivity({
      title: 'Claim Approved',
      description: `Tool ownership claim verified for ${toolName}`,
      icon: '🔐',
      user_id: userId,
      entity_type: 'tool',
      entity_name: toolName,
    });
  }

  async logUserRegistration(username: string, userId: number) {
    return this.logActivity({
      title: 'New User Registration',
      description: `${username} joined the platform`,
      icon: '👤',
      user_id: userId,
      entity_type: 'user',
      entity_name: username,
    });
  }

  async logContentCreated(contentType: string, contentName: string, userId: number) {
    return this.logActivity({
      title: `${contentType} Created`,
      description: `${contentName} created`,
      icon: this.getContentIcon(contentType),
      user_id: userId,
      entity_type: contentType.toLowerCase(),
      entity_name: contentName,
    });
  }

  async logContentPublished(contentType: string, contentName: string, userId: number) {
    return this.logActivity({
      title: `${contentType} Published`,
      description: `${contentName} published`,
      icon: '📢',
      user_id: userId,
      entity_type: contentType.toLowerCase(),
      entity_name: contentName,
    });
  }

  async logContentDeleted(contentType: string, contentName: string, userId: number) {
    return this.logActivity({
      title: `${contentType} Deleted`,
      description: `${contentName} deleted`,
      icon: '🗑️',
      user_id: userId,
      entity_type: contentType.toLowerCase(),
      entity_name: contentName,
    });
  }

  private getContentIcon(contentType: string): string {
    switch (contentType.toLowerCase()) {
      case 'article':
        return '📰';
      case 'news':
        return '📢';
      case 'learning':
        return '🎓';
      case 'prompt':
        return '🤖';
      case 'glossary':
        return '📚';
      default:
        return '📝';
    }
  }
}
