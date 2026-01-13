import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/api/notifications';

// Query Keys
export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (page: number, limit: number) => [...notificationsKeys.lists(), page, limit] as const,
};

// Hook for fetching notifications
export const useNotifications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: notificationsKeys.list(page, limit),
    queryFn: () => getNotifications(page, limit),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes (no polling)
    // Removed refetchInterval - using Pusher for real-time updates
  });
};

// Hook for loading more notifications
export const useLoadMoreNotifications = () => {
  return useMutation({
    mutationFn: ({ page, limit }: { page: number; limit: number }) => 
      getNotifications(page, limit),
  });
};

// Hook for marking a notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate all notification queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};

// Hook for marking all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate all notification queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};
