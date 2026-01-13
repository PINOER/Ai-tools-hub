import { useQuery } from "@tanstack/react-query";
import { getTagsApi } from "@/api/tags";

// Query Keys
export const tagsKeys = {
  all: ["tags"] as const,
  lists: () => [...tagsKeys.all, "list"] as const,
};

// Fetch tags
export function useTagsQuery() {
  return useQuery({
    queryKey: tagsKeys.lists(),
    queryFn: async () => {
      const result = await getTagsApi();
      return result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - tags don't change often
  });
}
