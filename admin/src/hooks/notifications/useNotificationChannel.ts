import { useEffect, useRef } from "react";
import { pusher, NOTIFICATION_EVENTS } from "@/lib/pusher";
import type { Notification } from "@/types/notification";
import { useToolsQuery } from "../queries/useToolsQuery";
import { useToolsFilters } from "../filters/useToolsFilters";

interface NotificationChannelData {
  notification: Notification;
  unreadCount: number;
}

interface UseNotificationChannelProps {
  userId: number;
  onNewNotification: (notification: Notification, unreadCount: number) => void;
  onNotificationRead: (notificationId: number, unreadCount: number) => void;
  onNotificationDeleted: (notificationId: number, unreadCount: number) => void;
}

export function useNotificationChannel({
  userId,
  onNewNotification,
  onNotificationRead,
  onNotificationDeleted,
}: UseNotificationChannelProps) {
  const channelRef = useRef<any>(null);
  const { filters } = useToolsFilters();

  const { refetch: refetchTools } = useToolsQuery(filters);

  useEffect(() => {
    if (!userId) return;

    // Subscribe to user-specific notification channel
    const channelName = `private-user-${userId}`;
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Handle new notification
    channel.bind(
      NOTIFICATION_EVENTS.NEW_NOTIFICATION,
      (data: NotificationChannelData) => {
        onNewNotification(data.notification, data.unreadCount);
      }
    );
    channel.bind(NOTIFICATION_EVENTS.BULK_UPLOAD_SUCCESS, () => {
      refetchTools();
    });
    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        pusher.unsubscribe(channelName);
        channelRef.current = null;
      }
    };
  }, [
    userId,
    onNewNotification,
    onNotificationRead,
    onNotificationDeleted,
    refetchTools,
  ]);

  return {
    isConnected: channelRef.current?.state === "subscribed",
  };
}
