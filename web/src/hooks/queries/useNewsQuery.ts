import { useQuery } from '@tanstack/react-query';
import { getNews, getNewsById } from '@/services/newsService';
import { queryKeys } from '@/types/api';

// React Query hooks for news
export const useNews = (
  page: number,
  limit: number,
  search?: string,
  filters?: {
    pricing_model?: string[];
    platform_availability?: string[];
    sort_by?: 'asc' | 'desc';
    category_id?: number;
    status?: string;
    moderation_status?: string;
  }
) => {
  return useQuery({
    queryKey: [...queryKeys.news.lists(), page, limit, search, filters],
    queryFn: () => getNews(page, limit, search, filters),
  });
};

export const useGetNewsByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["NewsId", id],
    queryFn: () => getNewsById(id)
  })
}