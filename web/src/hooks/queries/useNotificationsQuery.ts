import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '@/services/notificationsService';
import { queryKeys } from '@/types/api';
import { useUser } from '@clerk/nextjs';

// Hook for fetching notifications
export const useNotifications = (page: number = 1, limit: number = 2) => {
  const {user} = useUser()
  return useQuery({
    queryKey: queryKeys.notifications.list(page, limit),
    queryFn: () =>  getNotifications(page, limit),
    // Removed refetchInterval - now using Pusher for real-time updates
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    enabled:!!user?.id
  });
};

// Hook for marking a notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate all notification queries to refetch with updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

