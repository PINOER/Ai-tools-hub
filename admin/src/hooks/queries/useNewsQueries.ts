import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNewsApi, 
  getNewsByIdApi,
  createNewsApi,
  updateNewsApi,
  deleteNewsApi,
  type NewsFilters 
} from '@/api/news';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Queries
export const useNewsQuery = (filters: NewsFilters = {}) => {
  return useQuery({
    queryKey: ['news', filters],
    queryFn: () => getNewsApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewsByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => getNewsByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateNewsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createNewsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      showSuccessToast('News created successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to create news');
      console.error('Create news error:', error);
    },
  });
};

export const useUpdateNewsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateNewsApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['news', id] });
      showSuccessToast('News updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update news');
      console.error('Update news error:', error);
    },
  });
};

export const useDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteNewsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      showSuccessToast('News deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete news');
      console.error('Delete news error:', error);
    },
  });
};

export const useBulkDeleteNewsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => deleteNewsApi(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      showSuccessToast('News deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete news');
      console.error('Bulk delete news error:', error);
    },
  });
};

export const useBulkUpdateNewsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: any }) => {
      const promises = ids.map(id => updateNewsApi(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      showSuccessToast('News updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update news');
      console.error('Bulk update news error:', error);
    },
  });
}; 