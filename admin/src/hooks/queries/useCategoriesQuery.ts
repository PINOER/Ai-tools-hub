import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesApi, type CategoriesFilters } from "@/api/categories";
import { deleteMultipleToolCategoriesApi, deleteToolCategoryApi } from "@/api/tools";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import queryClient from "@/lib/queryClient";

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



// Delete single tool category mutation
export function useDeleteToolCategoryMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteToolCategoryApi(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      showSuccessToast('Tool category deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting tool category:', error);
      showErrorToast(error.message);
    },
  });
}

// Delete multiple tool categories mutation
export function useDeleteMultipleToolCategoriesMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteMultipleToolCategoriesApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      showSuccessToast(`${ids.length} tool categories deleted successfully!`);
    },
    onError: (error) => {
      console.error('Error deleting tool categories:', error);
      showErrorToast(error.message);
    },
  });
}
