import { api } from "./api";

export type Category = {
  id: number;
  section: string;
  name: string;
  url_slug: string;
  description: string;
  display_order: number;
  seo_title: string;
  parentCategoryId: number | null;
  createdAt: string;
  updatedAt: string;
  parent_category: {
    name: string;
  } | null;
  items: number;
  subcategories?: Category[];
};

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
  const response = await api.get<CategoriesResponse>(url);
  return response;
};