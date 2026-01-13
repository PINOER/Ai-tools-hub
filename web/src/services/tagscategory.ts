import { CategoriesResponse } from '@/types/api';
import { api } from './api';


export interface TagsCategoryFilters {
  page: number;
  limit: number;
  section?: string;
}

export const getTagsCategory = async (filters: TagsCategoryFilters) => {
  try {
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());
    if (filters.section) {
      params.append('section', filters.section);
    }
    const url = `/categories?${params.toString()}`;
    const response = await api.get<CategoriesResponse>(url);

    // Handle different possible response structures
    const responseData = response;

    // If response is directly the data we need
    if (responseData && responseData.categories) {
      return responseData;
    }

    // Fallback with empty data
    return {
      categories: [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: 0,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty data instead of throwing
    return {
      categories: [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}