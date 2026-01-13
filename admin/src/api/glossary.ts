import type { Glossary } from "@/types/glossary";
import { apiClient } from "@/lib/apiClient";

export interface GlossaryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Published" | "Draft" | "Scheduled";
  category_id?: number;
  is_featured?: boolean;
  moderation_status?: string;
}

export interface GlossaryResponse {
  data: Glossary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getGlossaryApi = async (
  filters: GlossaryFilters = {},
): Promise<GlossaryResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.category_id)
    params.append("category_id", filters.category_id.toString());
  if (filters.is_featured !== undefined)
    params.append("featured", filters.is_featured.toString());
  if (filters.moderation_status)
    params.append("moderation_status", filters.moderation_status);

  const response = await apiClient.get<GlossaryResponse>(
    `/glossary/terms?${params.toString()}`,
  );
  return response.data;
};

export const getGlossaryByIdApi = async (id: number): Promise<Glossary> => {
  const response = await apiClient.get<{ data: Glossary }>(
    `/glossary/terms/${id}`,
  );
  return response.data.data;
};

export const createGlossaryApi = async (
  data: Omit<Glossary, "id">,
): Promise<Glossary> => {
  const response = await apiClient.post<{ data: Glossary }>("/glossary", data);
  return response.data.data;
};

export const updateGlossaryApi = async (
  id: number,
  data: Partial<Glossary>,
): Promise<Glossary> => {
  const response = await apiClient.put<{ data: Glossary }>(
    `/glossary/terms/${id}`,
    data,
  );
  return response.data.data;
};

export const deleteGlossaryApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/glossary/terms/${id}`);
};
