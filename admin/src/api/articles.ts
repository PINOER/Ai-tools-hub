import type { Article } from "@/types/article";
import { apiClient } from "@/lib/apiClient";

export interface ArticleFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Published" | "Draft" | "Scheduled";
  category_id?: number;
  is_featured?: boolean;
  moderation_status?: string;
}

export interface ArticleResponse {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getArticleApi = async (
  filters: ArticleFilters = {},
): Promise<ArticleResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.category_id)
    params.append("category_id", filters.category_id.toString());
  if (filters.is_featured !== undefined)
    params.append("is_featured", filters.is_featured.toString());
  if (filters.moderation_status)
    params.append("moderation_status", filters.moderation_status);

  const response = await apiClient.get<ArticleResponse>(
    `/articles?${params.toString()}`,
  );
  return response.data;
};

export const getArticleByIdApi = async (id: number): Promise<Article> => {
  const response = await apiClient.get<{ data: Article }>(
    `/articles/${id}`,
  );
  return response.data.data;
};

export const createArticleApi = async (
  data: Omit<Article, "id">,
): Promise<Article> => {
  const response = await apiClient.post<{ data: Article }>("/articles", data);
  return response.data.data;
};

export const updateArticleApi = async (
  id: number,
  data: Partial<Article>,
): Promise<Article> => {
  const response = await apiClient.put<{ data: Article }>(
    `/articles/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteArticleApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/articles/${id}`);
};
