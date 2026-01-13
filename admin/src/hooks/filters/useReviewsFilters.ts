import { useMemo } from 'react';
import { useFilters, type FilterConfig } from './useFilters';
import { ReviewStatus } from '@/types/reviews';

export interface ReviewsFilters {
  page: number;
  limit: number;
  search: string;
  status?: string;
}

const initialReviewsFilters: ReviewsFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: undefined,
};

export function useReviewsFilters() {
  // Create filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search reviews...',
      defaultValue: '',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Approved', value: ReviewStatus.Approved },
        { label: 'Pending Report', value: ReviewStatus.PendingReport },
        { label: 'Reported', value: ReviewStatus.Reported },
        { label: 'Flagged', value: ReviewStatus.Flagged },
      ],
      defaultValue: undefined,
    },
  ], []);

  const filterHook = useFilters({
    initialFilters: initialReviewsFilters,
    configs: filterConfigs,
    onFiltersChange: undefined, // Don't call API on filter changes
  });

  // Add reviews-specific computed values
  const computedValues = useMemo(() => ({
    // Check if search is active
    hasSearch: filterHook.filters.search.trim() !== '',
    
    // Check if status filter is active
    hasStatusFilter: filterHook.filters.status !== undefined,
    
    // Get search term
    searchTerm: filterHook.filters.search.trim(),
    
    // Get selected status
    selectedStatus: filterHook.filters.status,
  }), [filterHook.filters]);

  return {
    ...filterHook,
    ...computedValues,
  };
} 