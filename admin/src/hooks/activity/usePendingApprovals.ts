import { useQuery } from '@tanstack/react-query';
import { getPendingApprovals } from '@/api/activity';

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: getPendingApprovals,
    staleTime: 60 * 1000, // 1 minute
  });
};
