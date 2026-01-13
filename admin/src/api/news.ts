import type { CreateNews, News } from '@/types/news';
import { apiClient } from '@/lib/apiClient';

export interface NewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: string;
  featured?: boolean;
  moderation_status?: string;
}

export interface NewsResponse {
  news: News[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getNewsApi = async (filters: NewsFilters = {}): Promise<NewsResponse> => {
  const response = await apiClient.get('/news', { params: filters });
  return response.data;
};

export const getNewsByIdApi = async (id: number): Promise<News> => {
  const response = await apiClient.get(`/news/${id}`);
  return response.data;
};

export const createNewsApi = async (data: CreateNews): Promise<News> => {
  const response = await apiClient.post('/news', data);
  return response.data;
};

export const updateNewsApi = async (id: number, data: Partial<Omit<CreateNews, 'id'>>): Promise<News> => {
  const response = await apiClient.put(`/news/${id}`, data);
  return response.data;
};

export const deleteNewsApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/news/${id}`);
};
