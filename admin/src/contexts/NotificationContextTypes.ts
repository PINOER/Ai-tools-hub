import { createContext } from "react";
import type { Notification } from "@/types/notification";

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  loadMore: () => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  isMarkingAsRead: boolean;
  isMarkingAllAsRead: boolean;
  refetch: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);
