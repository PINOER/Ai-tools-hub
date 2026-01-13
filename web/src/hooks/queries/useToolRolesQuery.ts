import { useQuery } from '@tanstack/react-query';
import { getToolRoles, ToolRolesParams } from '@/services/toolRolesService';
import { ToolRolesResponse } from '@/types/api';

export const toolRolesKeys = {
  all: ['toolRoles'] as const,
  lists: () => [...toolRolesKeys.all, 'list'] as const,
  list: (params: ToolRolesParams) => [...toolRolesKeys.lists(), params] as const,
};

export const useToolRolesQuery = (params: ToolRolesParams = {}) => {
  return useQuery<ToolRolesResponse>({
    queryKey: toolRolesKeys.list(params),
    queryFn: () => getToolRoles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};