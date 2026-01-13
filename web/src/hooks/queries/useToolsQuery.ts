import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateTool } from '@/types/tools';
import { createToolsApi, getToolById, getTools } from '@/services/tools';

interface ToolsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  tag_ids?: number[];
  status?: string;
  pricing_model?: string;
  platform_availability?: string[];
  is_featured?: boolean;
  is_claimed?: boolean;
}

// Query Keys
export const toolsKeys = {
  all: ['tools'] as const,
  lists: () => [...toolsKeys.all, 'list'] as const,
  list: (filters: ToolsFilters) => [...toolsKeys.lists(), filters] as const,
  details: () => [...toolsKeys.all, 'detail'] as const,
  detail: (id: number) => [...toolsKeys.details(), id] as const,
};

// Create tool mutation
export function useCreateToolMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toolData: CreateTool) => {
      const result = await createToolsApi(toolData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsKeys.lists() });
    },
  });
}


export const useGetToolsQuery = (page: number,
  limit: number,
  search?: string,
  filters?: {
    tool_role_ids?: number[];
    tool_industry_ids?: number[];
    pricing_model?: string[];
    platform_availability?: string[];
    sort_by?: 'asc' | 'desc';
    category_id?: number;
  }) => {
  return useQuery({
    queryKey: ['tools', page, limit, search, filters],
    queryFn: () => getTools(page, limit, search, filters)
  })
}

export const useGetToolByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => getToolById(id),
    enabled: !!id
  })
}

// export const useTools = (page: number, limit: number, search?: string, filters?: {
//   pricing_model?: string[];
//   platform_availability?: string[];
//   sort_by?: 'asc' | 'desc';
//   category_id?: number;
// }) => {
//   return useQuery({
//     queryKey: ['tools', page, limit, search, filters],
//     queryFn: () => getTools(page, limit, search, filters),
//   });
// };