import { api } from './api';
import { NotificationsApiResponse } from '@/types/api';

export const getNotifications = async (
  page: number,
  limit: number
): Promise<NotificationsApiResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const url = `/notifications?${params.toString()}`;
    const response = await api.get<NotificationsApiResponse>(url);

    return response;
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
    await api.patch(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await api.patch('/notifications/mark-all-read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

