import { useState, useCallback, useMemo } from 'react';

export interface FilterState {
  [key: string]: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'number';
  options?: Array<{ label: string; value: any }>;
  defaultValue?: any;
  placeholder?: string;
}

export interface UseFiltersOptions<T extends FilterState> {
  initialFilters: T;
  configs: FilterConfig[];
  onFiltersChange?: (filters: T) => void;
}

export function useFilters<T extends FilterState>({
  initialFilters,
  configs,
  onFiltersChange,
}: UseFiltersOptions<T>) {
  const [filters, setFiltersState] = useState<T>(initialFilters);

  // Update filters immediately
  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFiltersState(prev => {
      const updated = { ...prev, ...newFilters };
      // Call onFiltersChange callback if provided
      onFiltersChange?.(updated);
      return updated;
    });
  }, [onFiltersChange]);

 

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = { ...initialFilters };
    setFiltersState(clearedFilters);
    onFiltersChange?.(clearedFilters);
  }, [initialFilters, onFiltersChange]);

  // Reset filters to initial state
  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    onFiltersChange?.(initialFilters);
  }, [initialFilters, onFiltersChange]);

  // Get filter value
  const getFilterValue = useCallback((key: keyof T) => {
    return filters[key];
  }, [filters]);

  // Set single filter value
  const setFilterValue = useCallback((key: keyof T, value: any) => {
    updateFilters({ [key]: value } as Partial<T>);
  }, [updateFilters]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== null && value !== undefined;
    });
  }, [filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      if (typeof value === 'boolean') {
        return value === true;
      }
      return value !== null && value !== undefined;
    }).length;
  }, [filters]);

  const filterOptions = useMemo(() => {
    return configs.map(config => ({
      ...config,
      value: getFilterValue(config.key as keyof T),
    }));
  }, [configs, getFilterValue]);

  return {
    filters,
    
    // Actions
    updateFilters,
    clearFilters,
    resetFilters,
    setFilterValue,
    getFilterValue,
    
    // Computed
    hasActiveFilters,
    activeFilterCount,
    filterOptions,
    
    // Configs
    configs,
  };
} 