export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  timeAgo: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  read?: boolean;
}

export interface NotificationResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MarkAsReadRequest {
  id: number;
}

export interface MarkAllAsReadResponse {
  message: string;
  updated_count: number;
}
