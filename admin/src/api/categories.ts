import type { Category } from '@/types/categories';
import { apiClient } from '@/lib/apiClient';

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CategoriesFilters {
  page?: number;
  limit?: number;
  section?: string;
  search?: string;
  parent_id?: string;
}

export const getCategoriesApi = async (filters?: CategoriesFilters): Promise<CategoriesResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.section) params.append('section', filters.section);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.parent_id) params.append('parent_id', filters.parent_id);
  
  const url = `/categories?${params.toString()}`;
  const response = await apiClient.get<CategoriesResponse>(url);
  return response.data;
};

export const createCategoryApi = async (
  data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'items'>
): Promise<Category> => {
  const response = await apiClient.post('/categories', data);
  return response.data.data;
};

export const deleteCategoryApi = async (id: number) => {
  await apiClient.delete(`/categories/${id}`);
};
