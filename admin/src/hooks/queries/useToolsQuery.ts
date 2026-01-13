import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getToolsApi, 
  deleteToolsApi, 
  createToolsApi, 
  updateToolsApi,
  approveToolSubmissionApi,
  approveMultipleToolSubmissionsApi,
  updateToolSubmissionStatusApi,
  updateMultipleToolSubmissionsStatusApi,
  deleteMultipleToolsApi,
  getToolSubmissionsApi,
  deleteToolSubmissionApi,
  deleteMultipleToolSubmissionsApi,
  updateToolClaimStatusApi,
  updateMultipleToolClaimsStatusApi,
  deleteToolClaimApi,
  deleteMultipleToolClaimsApi,
  getToolClaimsApi,
} from '@/api/tools';
import { useUser } from '../useUser';
import { queryClient } from '@/lib/queryClient';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import type { Tools, CreateTool } from '@/types/tools';
import { ToolsStatus } from '@/types/tools';
import type { ClaimsFilters } from '../filters/useClaimsFilters';

interface ToolsFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  tag_ids?: number[];
  status?: string;
  pricing_model?: string;
  platform_availability?: string[];
  is_featured?: boolean;
  is_claimed?: boolean;
}

// Query Keys
export const toolsKeys = {
  all: ['tools'] as const,
  lists: () => [...toolsKeys.all, 'list'] as const,
  list: (filters: ToolsFilters) => [...toolsKeys.lists(), filters] as const,
  details: () => [...toolsKeys.all, 'detail'] as const,
  detail: (id: number) => [...toolsKeys.details(), id] as const,
};

export const submissionsKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionsKeys.all, 'list'] as const,
  list: (filters: ToolsFilters) => [...submissionsKeys.lists(), filters] as const,
};

export const claimsKeys = {
  all: ['claims'] as const,
  lists: () => [...claimsKeys.all, 'list'] as const,
  list: (filters: ClaimsFilters) => [...claimsKeys.lists(), filters] as const,
  details: () => [...claimsKeys.all, 'detail'] as const,
  detail: (id: number) => [...claimsKeys.details(), id] as const,
};

// Fetch claims with filters
export function useClaimsQuery(filters: ClaimsFilters = {
  page: 1,
  limit: 10,
  search: '',
}) {
  return useQuery({
    queryKey: claimsKeys.list(filters),
    queryFn: async () => {
      const result = await getToolClaimsApi(filters);
      return result;
    },
    staleTime: 2 * 60 * 1000,
  });
}






// Fetch tools with filters
export function useToolsQuery(filters: ToolsFilters = {}) {
  const userHook = useUser();

  return useQuery({
    queryKey: toolsKeys.list(filters),
    queryFn: async () => {
      if (!userHook.token) throw new Error('No token available');
      const result = await getToolsApi(filters);
      return result;
    },
    enabled: !!userHook.token,
    staleTime: 100, // 5 minutes
  });
}

// Fetch submissions with filters
export function useSubmissionsQuery(filters: ToolsFilters = {}) {
  const userHook = useUser();

  return useQuery({
    queryKey: submissionsKeys.list(filters),
    queryFn: async () => {
      if (!userHook.token) throw new Error('No token available');
      const result = await getToolSubmissionsApi(filters);
      return result;
    },
    enabled: !!userHook.token,
    staleTime: 100, // 5 minutes
  });
}

// Create tool mutation
export function useCreateToolMutation() {
  return useMutation({
    mutationFn: async (toolData: CreateTool) => {
      const result = await createToolsApi(toolData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toolsKeys.lists() });
      showSuccessToast('Tool created successfully!');
    },
    onError: (error) => {
      console.error('Error creating tool:', error);
      showErrorToast('Failed to create tool');
    },
  });
}

// Update tool mutation
export function useUpdateToolMutation() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Tools> }) => {
      await updateToolsApi(id, data);
      return { id, data };
    },
    onSuccess: (_, { id }) => {
      queryClient.removeQueries({ queryKey: toolsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: toolsKeys.lists() });
      showSuccessToast('Tool updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating tool:', error);
      showErrorToast('Failed to update tool');
    },
  });
}

// Delete tool mutation
export function useDeleteToolMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteToolsApi(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: toolsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: toolsKeys.lists() });
      showSuccessToast('Tool deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting tool:', error);
      showErrorToast('Failed to delete tool');
    },
  });
}

// Generic submission status update mutation
export function useUpdateSubmissionStatusMutation() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ToolsStatus }) => {
      await updateToolSubmissionStatusApi(id, status);
      return { id, status };
    },
    onSuccess: ({ status }) => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      const action = status === ToolsStatus.Approved ? 'approved' : 'rejected';
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
      showSuccessToast(`Submission ${action} successfully!`);
    },
    onError: (error) => {
      console.error('Error updating submission status:', error);
      showErrorToast('Failed to update submission status');
    },
  });
}

// Approve single submission mutation
export function useApproveSubmissionMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await approveToolSubmissionApi(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
      showSuccessToast('Submission approved successfully!');
    },
    onError: (error) => {
      console.error('Error approving submission:', error);
      showErrorToast('Failed to approve submission');
    },
  });
}

// Generic bulk submission status update mutation
export function useUpdateMultipleSubmissionsStatusMutation() {
  return useMutation({
    mutationFn: async ({ ids, status }: { ids: number[]; status: ToolsStatus }) => {
      await updateMultipleToolSubmissionsStatusApi(ids, status);
      return { ids, status };
    },
    onSuccess: ({ ids, status }) => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      const action = status === ToolsStatus.Approved ? 'approved' : 'rejected';
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
      showSuccessToast(`${ids.length} submissions ${action} successfully!`);
    },
    onError: (error) => {
      console.error('Error updating submissions status:', error);
      showErrorToast('Failed to update submissions status');
    },
  });
}

// Approve multiple submissions mutation
export function useApproveMultipleSubmissionsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await approveMultipleToolSubmissionsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      showSuccessToast(`${ids.length} submissions approved successfully!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
    },
    onError: (error) => {
      console.error('Error approving submissions:', error);
      showErrorToast('Failed to approve submissions');
    },
  });
}

// Approve single claim mutation


// Reject submission mutation
export function useRejectSubmissionMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await updateToolSubmissionStatusApi(id, ToolsStatus.Rejected);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
      showSuccessToast('Submission rejected successfully!');
    },
    onError: (error) => {
      console.error('Error rejecting submission:', error);
      showErrorToast('Failed to reject submission');
    },
  });
}

// Reject multiple submissions mutation
export function useRejectMultipleSubmissionsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await updateMultipleToolSubmissionsStatusApi(ids, ToolsStatus.Rejected);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      showSuccessToast(`${ids.length} submissions rejected successfully!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
    },
    onError: (error) => {
      console.error('Error rejecting submissions:', error);
      showErrorToast('Failed to reject submissions');
    },
  });
}

// Delete single submission mutation
export function useDeleteSubmissionMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteToolSubmissionApi(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
      showSuccessToast('Submission deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting submission:', error);
      showErrorToast('Failed to delete submission');
    },
  });
}

// Delete multiple submissions mutation
export function useDeleteMultipleSubmissionsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteMultipleToolSubmissionsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: submissionsKeys.all });
      showSuccessToast(`${ids.length} submissions deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
    },
    onError: (error) => {
      console.error('Error deleting submissions:', error);
      showErrorToast('Failed to delete submissions');
    },
  });
}

// Delete multiple tools mutation
export function useDeleteMultipleToolsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteMultipleToolsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: toolsKeys.lists() });
      showSuccessToast(`${ids.length} tools deleted successfully!`);
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats']});
    },
    onError: (error) => {
      console.error('Error deleting tools:', error);
      showErrorToast('Failed to delete tools');
    },
  });
} 

export function useUpdateToolClaimStatusMutation() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ToolsStatus }) => {
      await updateToolClaimStatusApi(id, status);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.all });
      showSuccessToast('Claim approved successfully!');
    },
    onError: (error) => {
      console.error('Error approving claim:', error);
      showErrorToast('Failed to approve claim');
    },
  });
}

// Approve multiple claims mutation
export function useUpdateMultipleToolClaimsStatusMutation() {
  return useMutation({
    mutationFn: async ({ ids, status }: { ids: number[]; status: ToolsStatus }) => {
      await updateMultipleToolClaimsStatusApi(ids, status);
      return { ids, status };
    },
    onSuccess: ({ ids }) => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.all });
      showSuccessToast(`${ids.length} claims approved successfully!`);
    },
    onError: (error) => {
      console.error('Error approving claims:', error);
      showErrorToast(error.message);
    },
  });
}

export function useDeleteToolClaimMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteToolClaimApi(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.all });
      showSuccessToast('Tool claim deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting tool claim:', error);
      showErrorToast('Failed to delete tool claim');
    },
  });
}

export function useDeleteMultipleToolClaimsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteMultipleToolClaimsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: claimsKeys.all });
      showSuccessToast(`${ids.length} tool claims deleted successfully!`);
    },
    onError: (error) => {
      console.error('Error deleting tool claims:', error);
      showErrorToast('Failed to delete tool claims');
    },
  });
}