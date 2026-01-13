import { useQuery } from '@tanstack/react-query';
import { getToolIndustries, ToolIndustriesParams } from '@/services/toolIndustriesService';
import { ToolIndustriesResponse } from '@/services/toolIndustriesService';

export const toolIndustriesKeys = {
  all: ['toolIndustries'] as const,
  lists: () => [...toolIndustriesKeys.all, 'list'] as const,
  list: (params: ToolIndustriesParams) => [...toolIndustriesKeys.lists(), params] as const,
};

export const useToolIndustriesQuery = (params: ToolIndustriesParams = {}) => {
  return useQuery<ToolIndustriesResponse>({
    queryKey: toolIndustriesKeys.list(params),
    queryFn: () => getToolIndustries(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};