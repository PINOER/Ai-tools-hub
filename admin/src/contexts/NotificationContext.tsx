"use client";

import React, { useState, useCallback, type ReactNode } from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useLoadMoreNotifications,
} from "@/hooks/notifications/useNotifications";
import { useNotificationChannel } from "@/hooks/notifications/useNotificationChannel";
import { NotificationContext } from "./NotificationContextTypes";
import type { Notification } from "@/types/notification";
import { useUser } from "@/hooks/useUser";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  const userHook = useUser();
  const userId = userHook.userId || 0;

  // Initial load - only fetch once, no polling
  const { data, isLoading, error, refetch } = useNotifications(currentPage, 20);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const loadMoreMutation = useLoadMoreNotifications();

  // Handle initial data load
  React.useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        // First load - replace all notifications
        setAllNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      } else {
        // Load more - append new notifications (filter duplicates)
        const existingIds = new Set(allNotifications.map((n) => n.id));
        const newNotifications = data.notifications.filter(
          (n) => !existingIds.has(n.id)
        );
        setAllNotifications((prev) => [...prev, ...newNotifications]);
      }

      setHasMore(data.pagination.hasNext);
      setTotalPages(data.pagination.totalPages);
    }
  }, [data, currentPage, allNotifications]);

  // Pusher event handlers
  const handleNewNotification = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleNotificationRead = useCallback(
    (notificationId: number, newUnreadCount: number) => {
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(newUnreadCount);
    },
    []
  );

  const handleNotificationDeleted = useCallback(
    (notificationId: number, newUnreadCount: number) => {
      setAllNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
      setUnreadCount(newUnreadCount);
    },
    []
  );

  // Subscribe to Pusher notifications
  useNotificationChannel({
    userId,
    onNewNotification: handleNewNotification,
    onNotificationRead: handleNotificationRead,
    onNotificationDeleted: handleNotificationDeleted,
  });

  const markAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const loadMore = () => {
    if (hasMore && !loadMoreMutation.isPending) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMoreMutation.mutate({ page: nextPage, limit: 20 });
    }
  };

  const value = {
    notifications: allNotifications,
    unreadCount,
    isLoading,
    isLoadingMore: loadMoreMutation.isPending,
    error: error as Error | null,
    hasMore,
    currentPage,
    totalPages,
    loadMore,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
