import { useState, useCallback } from 'react';
import type { CategoriesFilters } from '@/api/categories';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';

export const useCategoriesFilters = () => {
  const [filters, setFilters] = useState<CategoriesFilters>({
    page: 1,
    limit: 10,
    section: 'Tool',
  });

  const { data } = useCategoriesQuery({ section: 'Tool', limit: 1000 });
  
  // Get categories that have children (are parents of any category)
  const parentCategories = [
    ...(data?.categories || [])
      .filter(cat => cat?.subcategories && cat?.subcategories?.length > 0)
      .map(cat => ({
        value: cat.id.toString(),
        label: cat.name
      }))
  ];
  
  const updateFilters = useCallback((updates: Partial<CategoriesFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      // Reset to page 1 when filters change
      page: updates.page || 1,
      // Remove parent_id if "all" is selected
      parent_id: updates.parent_id === 'all' ? undefined : updates.parent_id,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      section: 'Tool',
    });
  }, []);

  const filterOptions = [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
    },
    {
      key: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      options: parentCategories,
    },
  ];

  return {
    filters,
    updateFilters,
    clearFilters,
    filterOptions,
  };
}; 