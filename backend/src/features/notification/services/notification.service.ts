import { prisma } from '../../../config/index.ts';
import { NotificationType } from '@prisma/client';
import { pusherService } from '../../../services/pusher.service.ts';

export interface CreateNotificationData {
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  action_url?: string; // URL to navigate when clicked (e.g., "/tools/123")
  entity_type?: string; // Type of entity (tool, article, news, etc.)
  entity_id?: number; // ID of the related entity
}

export interface NotificationItem {
  id: number;
  user_id: number | null;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string | null;
  entity_type?: string | null;
  entity_id?: number | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string | null;
  } | null;
  timeAgo: string;
}

export class NotificationService {
  async createNotification(data: CreateNotificationData) {
    // Validate that the user exists before creating notification
    const user = await prisma.user.findUnique({
      where: { id: data.user_id },
      select: { id: true },
    });

    if (!user) {
      console.warn(`Notification creation skipped: User with ID ${data.user_id} not found`);
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        user_id: data.user_id,
        type: data.type,
        title: data.title,
        message: data.message,
        action_url: data.action_url,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
      },
    });

    // Trigger Pusher notification event
    const notificationWithTimeAgo = {
      id: notification.id,
      user_id: data.user_id, // Use the validated user_id from data
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      action_url: notification.action_url,
      entity_type: notification.entity_type,
      entity_id: notification.entity_id,
      created_at: notification.created_at,
      updated_at: notification.updated_at,
      timeAgo: this.getTimeAgo(notification.created_at),
    };

    await pusherService.triggerNotification(data.user_id, notificationWithTimeAgo);

    return notification;
  }

  async getNotifications(
    userId: number,
    page: number = 1,
    limit: number = 20,
    type?: NotificationType,
    unreadOnly?: boolean
  ) {
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (type) {
      where.type = type;
    }
    if (unreadOnly) {
      where.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
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
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { user_id: userId, read: false } }),
    ]);

    const formattedNotifications: NotificationItem[] = notifications.map((notification) => ({
      ...notification,
      timeAgo: this.getTimeAgo(notification.created_at),
    }));

    return {
      notifications: formattedNotifications,
      unread_count: unreadCount,
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

  async getAdminNotifications(page: number = 1, limit: number = 20, type?: NotificationType) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) {
      where.type = type;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
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
      prisma.notification.count({ where }),
    ]);

    const formattedNotifications: NotificationItem[] = notifications.map((notification) => ({
      ...notification,
      timeAgo: this.getTimeAgo(notification.created_at),
    }));

    return {
      notifications: formattedNotifications,
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

  async getNotificationById(notificationId: number, userId: number) {
    return await prisma.notification.findFirst({
      where: {
        id: notificationId,
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
  }

  async markAsRead(notificationId: number, userId: number) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return updatedNotification;
  }

  async markAllAsRead(userId: number) {
    const result = await prisma.notification.updateMany({
      where: {
        user_id: userId,
        read: false,
      },
      data: { read: true },
    });
    return { count: result.count };
  }

  async deleteNotification(notificationId: number, userId: number) {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await prisma.notification.count({
      where: {
        user_id: userId,
        read: false,
      },
    });
  }

  async getNotificationStats() {
    const [total, unreadTotal, byType] = await Promise.all([
      prisma.notification.count(),
      prisma.notification.count({ where: { read: false } }),
      prisma.notification.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      total,
      unread_total: unreadTotal,
      by_type: byType.map((item) => ({
        type: item.type,
        count: item._count.id,
      })),
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

  // Generic helper method for content notifications (articles, news, learning, prompts, glossary)
  async notifyContentAction({
    entityType,
    entityId,
    entityName,
    userId,
    action,
  }: {
    entityType: string;
    entityId: number;
    entityName: string;
    userId: number;
    action: 'submitted' | 'approved' | 'rejected' | 'published';
    reason?: string;
  }) {
    const actionTitles = {
      submitted: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Submitted`,
      approved: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Approved`,
      rejected: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Rejected`,
      published: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Published`,
    };

    const actionMessages = {
      submitted: `A new ${entityType} "${entityName}" has been submitted for review`,
      approved: `Your ${entityType} "${entityName}" has been approved`,
      rejected: `Your ${entityType} "${entityName}" has been rejected`,
      published: `Your ${entityType} "${entityName}" has been published`,
    };

    // Map entity types to their URL paths
    const urlPaths: { [key: string]: string } = {
      article: 'articles',
      news: 'news',
      learning: 'learnings',
      prompt: 'prompts',
      glossary: 'glossary',
      tool: 'ai-tools',
    };

    return this.createNotification({
      user_id: userId,
      type:
        action === 'submitted'
          ? NotificationType.ToolSubmission
          : action === 'approved'
            ? NotificationType.ToolApproval
            : action === 'rejected'
              ? NotificationType.ToolRejection
              : NotificationType.Update,
      title: actionTitles[action],
      message: actionMessages[action],
      action_url: action !== 'rejected' ? `/${urlPaths[entityType]}/${entityId}` : undefined,
      entity_type: entityType,
      entity_id: entityId,
    });
  }
}
