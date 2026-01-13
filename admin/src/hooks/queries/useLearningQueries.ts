import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getLearningApi, 
  getLearningByIdApi,
  createLearningApi,
  updateLearningApi,
  deleteLearningApi,
  type LearningFilters 
} from '@/api/learning';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Queries
export const useLearningQuery = (filters: LearningFilters = {}) => {
  return useQuery({
    queryKey: ['learning', filters],
    queryFn: () => getLearningApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLearningByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['learning', id],
    queryFn: () => getLearningByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateLearningMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLearningApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      showSuccessToast('Learning created successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to create learning');
      console.error('Create learning error:', error);
    },
  });
};

export const useUpdateLearningMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateLearningApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      queryClient.invalidateQueries({ queryKey: ['learning', id] });
      showSuccessToast('Learning updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update learning');
      console.error('Update learning error:', error);
    },
  });
};

export const useDeleteLearningMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLearningApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      showSuccessToast('Learning deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete learning');
      console.error('Delete learning error:', error);
    },
  });
};

export const useBulkDeleteLearningMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => deleteLearningApi(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      showSuccessToast('Learning deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete Learning');
      console.error('Bulk delete Learning error:', error);
    },
  });
};

export const useBulkUpdateLearningMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: any }) => {
      const promises = ids.map(id => updateLearningApi(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning'] });
      showSuccessToast('Learning updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update Learning');
      console.error('Bulk update Learning error:', error);
    },
  });
}; 