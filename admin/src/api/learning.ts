import type { Learning } from "@/types/learning";
import { apiClient } from "@/lib/apiClient";

export interface LearningFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Published" | "Draft" | "Scheduled";
  category_id?: number;
  featured?: boolean;
  moderation_status?: string;
}

export interface LearningResponse {
  data: Learning[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getLearningApi = async (
  filters: LearningFilters = {},
): Promise<LearningResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.category_id)
    params.append("category_id", filters.category_id.toString());
  if (filters.featured !== undefined)
    params.append("featured", filters.featured.toString());
  if (filters.moderation_status)
    params.append("moderation_status", filters.moderation_status);

  const response = await apiClient.get<LearningResponse>(
    `/learnings?${params.toString()}`,
  );
  return response.data;
};

export const getLearningByIdApi = async (id: number): Promise<Learning> => {
  const response = await apiClient.get<{ data: Learning }>(
    `/learnings/${id}`,
  );
  return response.data.data;
};

export const createLearningApi = async (
  data: Omit<Learning, "id">,
): Promise<Learning> => {
  const response = await apiClient.post<{ data: Learning }>("/learnings", data);
  return response.data.data;
};

export const updateLearningApi = async (
  id: number,
  data: Partial<Learning>,
): Promise<Learning> => {
  const response = await apiClient.put<{ data: Learning }>(
    `/learnings/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteLearningApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/learnings/${id}`);
};