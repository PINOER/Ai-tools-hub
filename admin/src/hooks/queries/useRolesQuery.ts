import { useQuery } from '@tanstack/react-query';
import { getRolesApi } from '@/api/roles';

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRolesApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 