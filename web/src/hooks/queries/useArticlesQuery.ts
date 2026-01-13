import { useQuery } from '@tanstack/react-query';
import { getArticleById, getArticlesApi } from '@/services/articlesService';
import { queryKeys } from '@/types/api';

export const useArticles = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filters?: {
    category?: number;
    sort_by?: 'asc' | 'desc';
    status?: string;
    moderation_status?: string;
  }
) => {
  return useQuery({
    queryKey: [...queryKeys.articles.lists(), page, limit, search, filters],
    queryFn: () => getArticlesApi({ page, limit, search, filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};


export const useArticleByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
  });
};