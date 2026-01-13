import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi, type CategoriesFilters } from "@/services/categories";

// Query Keys
export const categoriesKeys = {
  all: ["categories"] as const,
  lists: () => [...categoriesKeys.all, "list"] as const,
  list: (type?: string) => [...categoriesKeys.lists(), type] as const,
  filtered: (filters: CategoriesFilters) =>
    [...categoriesKeys.lists(), filters] as const,
};

// Fetch categories with filters
export function useCategoriesQuery(filters?: CategoriesFilters) {
  return useQuery({
    queryKey: categoriesKeys.filtered(filters || {}),
    queryFn: async () => {
      const result = await getCategoriesApi(filters);
      return result;
    },
    staleTime: 0
  });
}