import { useMemo } from 'react';
import { useFilters, type FilterConfig } from './useFilters';
import { UserStatus } from '@/types/user';

export interface UsersFilters {
  page: number;
  limit: number;
  search: string;
  status?: UserStatus;
  role?: string;
  created_at?: string;
}

const initialUsersFilters: UsersFilters = {
  page: 1,
  limit: 10,
  search: '',
  status: undefined,
  role: undefined,
  created_at: undefined,
};

export function useUsersFilters() {
  // Create filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search users...',
      defaultValue: '',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: UserStatus.Active },
        { label: 'Inactive', value: UserStatus.Inactive },
        { label: 'Suspended', value: UserStatus.Suspended },
        { label: 'Banned', value: UserStatus.Banned },
      ],
      defaultValue: undefined,
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Moderator', value: 'Moderator' },
        { label: 'Contributor', value: 'Contributor' },
      ],
      defaultValue: undefined,
    },

    {
      key: 'created_at',
      label: 'Registration Date',
      type: 'text',
      placeholder: 'YYYY-MM-DD',
      defaultValue: undefined,
    },
  ], []);

  const filterHook = useFilters({
    initialFilters: initialUsersFilters,
    configs: filterConfigs,
    onFiltersChange: () => {
      // This will be called when filters change, triggering a re-query
      // The query will automatically re-run when the filters object changes
    },
  });

  // Add users-specific computed values
  const computedValues = useMemo(() => ({
    // Check if search is active
    hasSearch: filterHook.filters.search.trim() !== '',
    
    // Check if status filter is active
    hasStatusFilter: filterHook.filters.status !== undefined,
    
    // Check if role filter is active
    hasRoleFilter: filterHook.filters.role !== undefined,
    

    
    // Get search term
    searchTerm: filterHook.filters.search.trim(),
    
    // Get selected status name
    selectedStatusName: Object.values(UserStatus).find(status => status === filterHook.filters.status),
    
    // Get selected role name
    selectedRoleName: filterHook.filters.role,
  }), [filterHook.filters]);

  return {
    ...filterHook,
    ...computedValues,
    isLoading: false,
  };
} 