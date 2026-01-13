import type { Prompt, PromptsResponse, PromptSubmission } from "@/types/prompt";
import { apiClient } from "@/lib/apiClient";

export interface PromptsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Published" | "Draft" | "Scheduled";
  category_id?: string;
  featured?: boolean;
  moderation_status?: string;
}

export const getPromptsApi = async (
  filters: PromptsFilters = {}
): Promise<PromptsResponse> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.featured !== undefined)
    params.append("featured", filters.featured.toString());
  if (filters.moderation_status)
    params.append("moderation_status", filters.moderation_status);

  const response = await apiClient.get<PromptsResponse>(
    `/prompts?${params.toString()}`
  );
  return response.data;
};

export const getPromptByIdApi = async (id: number): Promise<Prompt> => {
  const response = await apiClient.get<Prompt>(`/prompts/${id}`);
  return response.data;
};

export const createPromptApi = async (
  data: Partial<Prompt>
): Promise<Prompt> => {
  const response = await apiClient.post<Prompt>("/prompts", data);
  return response.data;
};

export const updatePromptApi = async (
  id: number,
  data: Partial<Prompt>
): Promise<Prompt> => {
  const response = await apiClient.patch<Prompt>(`/prompts/${id}`, data);
  return response.data;
};

export const deletePromptApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/prompts/${id}`);
};

export const bulkDeletePromptsApi = async (
  promptIds: number[],
  force: boolean = false
): Promise<any> => {
  const response = await apiClient.post("/prompts/bulk-delete", {
    promptIds,
    force,
  });
  return response.data;
};

export const updatePromptStatusApi = async (
  id: number,
  status: string
): Promise<Prompt> => {
  const response = await apiClient.patch<Prompt>(`/prompts/${id}`, { status });
  return response.data;
};

export const updateMultiplePromptsStatusApi = async (
  prompts: { id: number; moderation_status: string }[]
): Promise<void> => {
  await apiClient.patch("/prompts/status/bulk-update", { prompts });
};

export const getPromptSubmissionsApi = async (
  filters: PromptsFilters = {}
): Promise<{ data: PromptSubmission[]; pagination: any }> => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);

  const response = await apiClient.get(
    `/prompts/submissions?${params.toString()}`
  );
  return response.data;
};
