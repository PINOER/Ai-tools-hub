"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/queries/useNotificationsQuery";
import { Notification } from "@/types/api";
import { usePusher } from "./PusherContext";
import { useUser } from "@clerk/nextjs";
import { getCurrentUserId } from "@/services/userService";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  isMarkingAsRead: boolean;
  isMarkingAllAsRead: boolean;
  refetch: () => void;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  loadMore: () => void;
  isLoadingMore: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, isLoading, error, refetch } = useNotifications(currentPage, 20);
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const { pusher, isConnected } = usePusher();
  const { user } = useUser();
  const userId = getCurrentUserId();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unread_count || 0;
  const hasMore = data?.pagination?.hasNext || false;
  const totalPages = data?.pagination?.totalPages || 1;

  // Combine all loaded notifications
  useEffect(() => {
    if (notifications.length > 0) {
      if (currentPage === 1) {
        setAllNotifications(notifications);
      } else {
        // Append new notifications, avoiding duplicates
        setAllNotifications((prev) => {
          const newNotifs = notifications.filter(
            (notif) => !prev.some((p) => p.id === notif.id)
          );
          return [...prev, ...newNotifs];
        });
      }
    }
  }, [notifications, currentPage]);

  // Set up Pusher real-time notifications
  useEffect(() => {
    if (!pusher || !isConnected || !user?.id) return;

    // Subscribe to user's public notification channel (no auth required)
    const channelName = `private-user-${userId}`;
    const channel = pusher.subscribe(channelName);

    // Listen for new notification event
    channel.bind("new-notification", (data: Notification) => {
      // Add new notification to the list
      setAllNotifications((prev) => {
        // Check if notification already exists
        if (prev.some((notif) => notif.id === data.id)) {
          return prev;
        }
        // Add to beginning of list
        return [data, ...prev];
      });

      // Refetch to update unread count
      refetch();
    });

    // Cleanup on unmount or when dependencies change
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [pusher, isConnected, user?.id, refetch]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;

    setIsLoadingMore(true);
    setCurrentPage((prev) => prev + 1);

    // Wait for the query to complete
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 500);
  }, [hasMore, isLoadingMore, isLoading]);

  const markAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleRefetch = () => {
    setCurrentPage(1);
    setAllNotifications([]);
    refetch();
  };

  const value: NotificationContextType = {
    notifications: currentPage === 1 ? notifications : allNotifications,
    unreadCount,
    isLoading,
    error: error as Error | null,
    markAsRead,
    markAllAsRead,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    refetch: handleRefetch,
    hasMore,
    currentPage,
    totalPages,
    loadMore,
    isLoadingMore,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
}
