import { ReviewStatus, type Review } from '@/types/reviews';
import { apiClient } from '@/lib/apiClient';

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReviewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  user_id?: number;
}

export const getAllReviewsApi = async (filters?: ReviewsFilters): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (filters?.page) queryParams.append('page', filters.page.toString());
  if (filters?.limit) queryParams.append('limit', filters.limit.toString());
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.user_id) queryParams.append('user_id', filters.user_id.toString());

  const url = `/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const response = await apiClient.get<ReviewsResponse>(url);
  return response.data;
};

export const createReviewApi = async (
  data: Omit<Review, 'id'>
): Promise<Review> => {
  const response = await apiClient.post('/reviews', data);
  return response.data.data;
};

export const getReviewApi = async (id: number): Promise<Review> => {
  const response = await apiClient.get(`/reviews/${id}`);

  return response.data.data;
};

export const updateReviewStatusApi = async (id: number, { status, remarks }: { status: string, remarks: string }): Promise<Review> => {
  const response = await apiClient.patch(`reviews/update-status/${id}`, { status, remarks });

  return response.data.data;
};

export const deleteReviewApi = async (id: number): Promise<Review> => {
  const response = await apiClient.delete(`/reviews/${id}`);

  return response.data.data;
};

export const updateMultipleReviewsApi = async (ids: number[]) => {
  await apiClient.patch(`/reviews/status/bulk-update`, {
    reviews: ids.map((id) => {
      return { id, status: ReviewStatus.Approved };
    }),
  });
}

export const deleteMultipleReviewsApi = async (ids: number[]) => {
  await apiClient.post(`/reviews/status/bulk-delete`, {
    ids
  });
};


