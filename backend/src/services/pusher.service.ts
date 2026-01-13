import { pusher } from '../config/index.ts';
import { NotificationType } from '@prisma/client';

export interface PusherNotificationPayload {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  action_url?: string | null;
  entity_type?: string | null;
  entity_id?: number | null;
  created_at: Date;
  updated_at: Date;
  timeAgo: string;
}

export interface PusherUnreadCountPayload {
  count: number;
}

export class PusherService {
  /**
   * Trigger a new notification event for a specific user
   * @param userId - The ID of the user to send notification to
   * @param notification - The notification data to send
   */
  async triggerNotification(
    userId: number,
    notification: PusherNotificationPayload
  ): Promise<void> {
    try {
      const channel = `private-user-${notification.user_id}`;
      const event = 'new-notification';
      await pusher.trigger(channel, event, notification);
    } catch (error) {
      console.error('Failed to send Pusher notification', {
        userId,
        notificationId: notification.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Don't throw error to prevent notification creation failure
    }
  }

  async triggerBulkUploadSuccess(userId: number, message: string): Promise<void> {
    try {
      const channel = `private-user-${userId}`;
      const event = 'bulk-upload-success';
      await pusher.trigger(channel, event, message);
    } catch (error) {
      console.error('Failed to send Pusher bulk upload success notification', {
        userId,
        message,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Don't throw error to prevent notification creation failure
    }
  }

  /**
   * Authenticate a user for private channels
   * @param socketId - The socket ID from Pusher
   * @param channel - The channel name to authenticate for
   * @param userId - The ID of the user to authenticate
   * @returns Authentication response
   */
  authenticateUser(socketId: string, channel: string, userId: number) {
    const expectedChannel = `private-user-${userId}`;
    if (channel !== expectedChannel) {
      throw new Error('Unauthorized channel access');
    }

    return pusher.authorizeChannel(socketId, channel);
  }
}

export const pusherService = new PusherService();
