import { useQuery } from '@tanstack/react-query';
import { getActivityFeed } from '@/api/activity';

export const useActivityFeed = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['activity-feed', page, limit],
    queryFn: () => getActivityFeed(page, limit),
    staleTime:  60 * 1000, // 1 minute
  });
};
