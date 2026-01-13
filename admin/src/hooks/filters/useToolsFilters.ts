import { useMemo } from 'react';
import { useFilters, type FilterConfig } from './useFilters';
import { useTagsQuery } from '../queries/useTagsQuery';
import { PricingModel, PlatformAvailability } from '@/types/tools';
import { useCategoriesQuery } from '../queries/useCategoriesQuery';

export interface ToolsFilters {
  page: number;
  limit: number;
  search: string;
  category_id?: number;
  tag_ids: number[];
  status?: string;
  pricing_model?: PricingModel;
  platform_availability: PlatformAvailability[];
  is_featured?: boolean;
  is_claimed?: boolean;
  free_plan_available?: boolean;
}

const initialToolsFilters: ToolsFilters = {
  page: 1,
  limit: 10,
  search: '',
  category_id: undefined,
  tag_ids: [],
  status: undefined,
  pricing_model: undefined,
  platform_availability: [],
  is_featured: undefined,
  is_claimed: undefined,
  free_plan_available: undefined,
};

export function useToolsFilters() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesQuery({ section: 'Tool', limit: 1000 });
  const { data: tagsData, isLoading: tagsLoading } = useTagsQuery();

  const isLoading = categoriesLoading || tagsLoading;

  // Ensure we have arrays for safe mapping
  const safeCategories = useMemo(() => {
    if (!categoriesData?.categories) return [];
    return Array.isArray(categoriesData.categories) ? categoriesData.categories : [];
  }, [categoriesData]);

  const safeTags = useMemo(() => {
    if (!tagsData) return [];
    return Array.isArray(tagsData) ? tagsData : [];
  }, [tagsData]);

  // Create filter configurations
  const filterConfigs = useMemo((): FilterConfig[] => [
    {
      key: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Search tools...',
      defaultValue: '',
    },
    {
      key: 'category_id',
      label: 'Category',
      type: 'select',
      options: safeCategories.map((cat: any) => ({ 
        label: cat.name, 
        value: cat.id 
      })),
      defaultValue: undefined,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
      
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' },
      ],
      defaultValue: undefined,
    },
    {
      key: 'pricing_model',
      label: 'Pricing Model',
      type: 'select',
      options: [
      
        { label: 'Free', value: 'Free' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Freemium', value: 'Freemium' },
        { label: 'Subscription', value: 'Subscription' },
        { label: 'Paid Only', value: 'PaidOnly' },
        { label: 'One Time Purchase', value: 'OneTimePurchase' },
      ],
      defaultValue: undefined,
    },
    {
      key: 'tag_ids',
      label: 'Tags',
      type: 'multiselect',
      options: safeTags.map((tag: any) => ({ 
        label: tag.name, 
        value: tag.id 
      })),
      defaultValue: [],
    },
    {
      key: 'platform_availability',
      label: 'Platform Availability',
      type: 'multiselect',
      options: [
        { label: 'Web', value: 'Web' },
        { label: 'Desktop', value: 'Desktop' },
        { label: 'Mobile App', value: 'MobileApp' },
        { label: 'Browser Extension', value: 'BrowserExtension' },
        { label: 'API', value: 'Api' },
      ],
      defaultValue: [],
    },
    {
      key: 'is_featured',
      label: 'Featured Tools Only',
      type: 'checkbox',
      defaultValue: undefined,
    },
    {
      key: 'is_claimed',
      label: 'Claimed Tools Only',
      type: 'checkbox',
      defaultValue: undefined,
    },
    {
      key: 'free_plan_available',
      label: 'Free Plan Available',
      type: 'checkbox',
      defaultValue: undefined,
    },
  ], [safeCategories, safeTags]);

  const filterHook = useFilters({
    initialFilters: initialToolsFilters,
    configs: filterConfigs,
    onFiltersChange: undefined, // Don't call API on filter changes
  });

  // Add tools-specific computed values
  const computedValues = useMemo(() => ({
    // Check if search is active
    hasSearch: filterHook.filters.search.trim() !== '',
    
    // Check if category filter is active
    hasCategoryFilter: filterHook.filters.category_id !== undefined,
    
    // Check if tags filter is active
    hasTagsFilter: filterHook.filters.tag_ids.length > 0,
    
    // Check if platform filter is active
    hasPlatformFilter: filterHook.filters.platform_availability.length > 0,
    
    // Check if free plan filter is active
    hasFreePlanFilter: filterHook.filters.free_plan_available === true,
    
    // Get search term
    searchTerm: filterHook.filters.search.trim(),
    
    // Get selected category name
    selectedCategoryName: safeCategories.find((cat: any) => cat.id === filterHook.filters.category_id)?.name,
    
    // Get selected tag names
    selectedTagNames: safeTags
      .filter((tag: any) => filterHook.filters.tag_ids.includes(tag.id))
      .map((tag: any) => tag.name),
  }), [filterHook.filters, safeCategories, safeTags]);

  return {
    ...filterHook,
    ...computedValues,
    isLoading,
  };
} 