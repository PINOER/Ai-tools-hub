import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getPromptsApi, 
  getPromptByIdApi, 
  getPromptSubmissionsApi,
  createPromptApi,
  updatePromptApi,
  deletePromptApi,
  updateMultiplePromptsStatusApi,
  type PromptsFilters, 
  bulkDeletePromptsApi
} from '@/api/prompts';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Queries
export const usePromptsQuery = (filters: PromptsFilters = {}) => {
  return useQuery({
    queryKey: ['prompts', filters],
    queryFn: () => getPromptsApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePromptByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['prompt', id],
    queryFn: () => getPromptByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePromptSubmissionsQuery = (filters: PromptsFilters = {}) => {
  return useQuery({
    queryKey: ['prompt-submissions', filters],
    queryFn: () => getPromptSubmissionsApi(filters),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreatePromptMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createPromptApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      showSuccessToast('Prompt created successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to create prompt');
      console.error('Create prompt error:', error);
    },
  });
};

export const useUpdatePromptMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePromptApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt', id] });
      showSuccessToast('Prompt updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update prompt');
      console.error('Update prompt error:', error);
    },
  });
};

export const useDeletePromptMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deletePromptApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt-submissions'] });
      showSuccessToast('Prompt deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete prompt');
      console.error('Delete prompt error:', error);
    },
  });
};

export const useBulkDeletePromptsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await bulkDeletePromptsApi(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt-submissions'] });
      showSuccessToast('Prompts deleted successfully');
    },
    onError: (error) => {
      showErrorToast(error.toString());
      console.log(error);
    },
  });
};

export const useBulkUpdatePromptsMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: any }) => {
     const prompts = ids.map(id => ({ id, moderation_status: data.moderation_status }));
     await updateMultiplePromptsStatusApi(prompts);
    },
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt-submissions'] });
      showSuccessToast(`${ids.length} prompts updated successfully`);
    },
    onError: (error) => {
      showErrorToast('Failed to update prompts');
      console.error('Bulk update prompts error:', error);
    },
  });
};
