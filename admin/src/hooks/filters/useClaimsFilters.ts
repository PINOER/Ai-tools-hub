import { useMemo } from 'react';
import { useFilters, type FilterConfig } from './useFilters';
import { ToolsStatus } from '@/types/tools';

export interface ClaimsFilters {
  page: number;
  limit: number;
  search: string;
  status?: string;
}

const initialClaimsFilters: ClaimsFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: undefined,
};

export function useClaimsFilters() {
  // Create filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search claims...',
      defaultValue: '',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Pending', value: ToolsStatus.Pending },
        { label: 'Approved', value: ToolsStatus.Approved },
        { label: 'Rejected', value: ToolsStatus.Rejected },
      ],
      defaultValue: undefined,
    },
  ], []);

  // Use the generic filter hook without automatic API calls
  const filterHook = useFilters({
    initialFilters: initialClaimsFilters,
    configs: filterConfigs,
    onFiltersChange: undefined, // Don't call API on filter changes
  });

  // Add claims-specific computed values
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