
import { getPromptById, getPrompts } from "@/services";
import { PromptsFilters } from "@/services/prompt";
import { useQuery } from "@tanstack/react-query";


export const usePromptQuery = (page: number, limit: number, search?: string, filters?: {
  category?: number;
  sort_by?: 'asc' | 'desc';
  status?: string;
  moderation_status?: string;
}) => {
  const filter: PromptsFilters = {
    page,
    limit,
    search,
    filters: filters || {},
  };
  return useQuery({
    queryKey: ['prompts', page, limit, search, filters],
    queryFn: () => getPrompts(filter),
  });
};

export const usePromptByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['prompt', id],
    queryFn: () => getPromptById(id),
    enabled: !!id,
  });
};
