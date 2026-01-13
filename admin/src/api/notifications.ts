import { apiClient } from '@/lib/apiClient';
import type { Notification } from '@/types/notification';

export interface NotificationsApiResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  unread_count: number;
}

export const getNotifications = async (
  page: number,
  limit: number
): Promise<NotificationsApiResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const url = `/notifications?${params.toString()}`;
    const response = await apiClient.get<NotificationsApiResponse>(url);

    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      notifications: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      },
      unread_count: 0
    };
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await apiClient.patch('/notifications/mark-all-read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};
