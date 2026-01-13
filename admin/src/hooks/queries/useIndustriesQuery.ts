import { useQuery } from '@tanstack/react-query';
import { getIndustriesApi } from '@/api/industries';

export const useIndustriesQuery = () => {
  return useQuery({
    queryKey: ['industries'],
    queryFn: getIndustriesApi,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 