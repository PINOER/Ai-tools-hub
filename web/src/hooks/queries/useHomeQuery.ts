import { useQuery } from "@tanstack/react-query";
import { getHomeData, type HomeServiceParams } from "@/services/homeService";

// Query Keys
export const homeKeys = {
  all: ["home"] as const,
  lists: () => [...homeKeys.all, "list"] as const,
  list: (params?: HomeServiceParams) => [...homeKeys.lists(), params] as const,
};

// Fetch home data with parameters
export function useHomeQuery(params?: HomeServiceParams) {
  return useQuery({
    queryKey: homeKeys.list(params),
    queryFn: async () => {
      const result = await getHomeData(params);
      return result;
    },
    staleTime: 0
  });
}