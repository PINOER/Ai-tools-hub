import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getAllReviewsApi,
  deleteReviewApi,
  deleteMultipleReviewsApi,
  updateReviewStatusApi,
  type ReviewsResponse,
  type ReviewsFilters as ApiReviewsFilters,
  updateMultipleReviewsApi
} from '@/api/reviews';
import { queryClient } from '@/lib/queryClient';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import type { ReviewsFilters } from '../filters/useReviewsFilters.ts';

// Query Keys
export const reviewsKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewsKeys.all, 'list'] as const,
  list: (filters: ReviewsFilters) => [...reviewsKeys.lists(), filters] as const,
  details: () => [...reviewsKeys.all, 'detail'] as const,
  detail: (id: number) => [...reviewsKeys.details(), id] as const,
};

// Fetch reviews with filters
export function useReviewsQuery(filters: ReviewsFilters = {
  page: 1,
  limit: 10,
  search: '',
}) {
  return useQuery<ReviewsResponse>({
    queryKey: reviewsKeys.list(filters),
    queryFn: async () => {
      const result = await getAllReviewsApi(filters as ApiReviewsFilters);
      return result;
    },
    staleTime: 1000,
  });
}

// Delete review mutation
export function useDeleteReviewMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteReviewApi(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
      showSuccessToast('Review deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      showErrorToast('Failed to delete review');
    },
  });
}

// Delete multiple reviews mutation
export function useDeleteMultipleReviewsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await deleteMultipleReviewsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
      showSuccessToast(`${ids.length} reviews deleted successfully!`);
    },
    onError: (error) => {
      console.error('Error deleting reviews:', error);
      showErrorToast('Failed to delete reviews');
    },
  });
}

// Single mutation for updating review status (Approve, Reject, Flag)
export function useUpdateReviewStatusMutation() {
  return useMutation({
    mutationFn: async ({ id, status, remarks }: { id: number; status: string; remarks: string }) => {
      await updateReviewStatusApi(id, { status, remarks });
      return { id, status, remarks };
    },
    onSuccess: ({ status }) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
      const statusText = status.charAt(0).toUpperCase() + status.slice(1);
      showSuccessToast(`Review ${statusText.toLowerCase()} successfully!`);
    },
    onError: (error) => {
      console.error('Error updating review status:', error);
      showErrorToast('Failed to update review status');
    },
  });
}

// Approve multiple reviews mutation
export function useUpdateMultipleReviewsMutation() {
  return useMutation({
    mutationFn: async (ids: number[]) => {
      await updateMultipleReviewsApi(ids);
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: reviewsKeys.lists() });
      showSuccessToast(`${ids.length} reviews approved successfully!`);
    },
    onError: (error) => {
      console.error('Error approving reviews:', error);
      showErrorToast('Failed to approve reviews');
    },
  });
} 