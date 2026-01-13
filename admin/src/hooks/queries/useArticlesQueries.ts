import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getArticleApi, 
  getArticleByIdApi,
  createArticleApi,
  updateArticleApi,
  deleteArticleApi,
  type ArticleFilters 
} from '@/api/articles';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Queries
export const useArticleQuery = (filters: ArticleFilters = {}) => {
  return useQuery({
    queryKey: ['article', filters],
    queryFn: () => getArticleApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useArticleByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      showSuccessToast('Article created successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to create article');
      console.error('Create article error:', error);
    },
  });
};

export const useUpdateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateArticleApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      showSuccessToast('Article updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update article');
      console.error('Update article error:', error);
    },
  });
};

export const useDeleteArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      showSuccessToast('Article deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete article');
      console.error('Delete article error:', error);
    },
  });
};

export const useBulkDeleteArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => deleteArticleApi(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      showSuccessToast('articles deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete articles');
      console.error('Bulk delete articles error:', error);
    },
  });
};

export const useBulkUpdateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: any }) => {
      const promises = ids.map(id => updateArticleApi(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['article'] });
      showSuccessToast('Articles updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update articles');
      console.error('Bulk update articles error:', error);
    },
  });
}; 