import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getGlossaryApi, 
  getGlossaryByIdApi,
  createGlossaryApi,
  updateGlossaryApi,
  deleteGlossaryApi,
  type GlossaryFilters 
} from '@/api/glossary';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

// Queries
export const useGlossaryQuery = (filters: GlossaryFilters = {}) => {
  return useQuery({
    queryKey: ['glossary', filters],
    queryFn: () => getGlossaryApi(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGlossaryByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['glossary', id],
    queryFn: () => getGlossaryByIdApi(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useCreateGlossaryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGlossaryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossary'] });
      showSuccessToast('Glossary created successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to create glossary');
      console.error('Create glossary error:', error);
    },
  });
};

export const useUpdateGlossaryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateGlossaryApi(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['glossary'] });
      queryClient.invalidateQueries({ queryKey: ['glossary', id] });
      showSuccessToast('Glossary updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update glossary');
      console.error('Update glossary error:', error);
    },
  });
};

export const useDeleteGlossaryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteGlossaryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossary'] });
      showSuccessToast('Glossary deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete glossary');
      console.error('Delete glossary error:', error);
    },
  });
};

export const useBulkDeleteGlossaryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => deleteGlossaryApi(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossary'] });
      showSuccessToast('Glossaries deleted successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to delete glossaries');
      console.error('Bulk delete glossaries error:', error);
    },
  });
};

export const useBulkUpdateGlossaryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ids, data }: { ids: number[]; data: any }) => {
      const promises = ids.map(id => updateGlossaryApi(id, data));
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['glossary'] });
      showSuccessToast('Glossaries updated successfully');
    },
    onError: (error) => {
      showErrorToast('Failed to update glossaries');
      console.error('Bulk update glossaries error:', error);
    },
  });
}; 