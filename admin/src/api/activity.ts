import { apiClient } from '@/lib/apiClient';

export interface ActivityUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  icon: string | null;
  user_id: number;
  reference_id: number | null;
  entity_type: string;
  entity_name: string;
  metadata: any;
  created_at: string;
  user: ActivityUser;
  timeAgo: string;
}

export interface ActivityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ActivityResponse {
  activities: Activity[];
  pagination: ActivityPagination;
}

export const getActivityFeed = async (page: number = 1, limit: number = 10): Promise<ActivityResponse> => {
  const response = await apiClient.get(`/activity/feed?page=${page}&limit=${limit}`);
  return response.data;
};

export interface PendingApprovals {
  toolSubmissions: number;
  toolClaims: number;
  articleReviews: number;
  glossaryReviews: number;
  promptReviews: number;
  learningReviews: number;
  reviewModerations: number;
  total: number;
}

export const getPendingApprovals = async (): Promise<PendingApprovals> => {
  const response = await apiClient.get('/home/pending-approvals');
  return response.data;
};

export interface DashboardStats {
  activeUsers: {
    count: number;
    growth: number;
  };
  totalTools: {
    count: number;
    growth: number;
  };
  totalCategories: {
    count: number;
    growth: number;
  };
  reviews: {
    count: number;
    growth: number;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get('/home/dashboard-stats');
  return response.data;
};
