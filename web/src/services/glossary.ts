import { api } from './api';
import { GlossaryApiResponse, GlossaryId } from '@/types/api';


export interface GlossaryFilters {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    category?: number;
    sort_by?: 'asc' | 'desc';
    status?: string;
    moderation_status?: string;
  }
}


export const getGlossaryApi = async (filters?: GlossaryFilters) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', filters?.page?.toString() || '1');
    params.append('limit', filters?.limit?.toString() || '10');

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (filters?.filters?.category) {
      params.append('category_id', filters.filters.category.toString());
    }

    if (filters?.filters?.sort_by) {
      params.append('sort_by', filters.filters.sort_by);
    }
    if (filters?.filters?.status) {
      params.append('status', filters.filters.status);
    }

    if (filters?.filters?.moderation_status) {
      params.append('moderation_status', filters.filters.moderation_status);
    }
    const url = `/glossary/terms?${params.toString()}`;
    const response = await api.get<GlossaryApiResponse>(url);
    return response;
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    // Return empty data instead of throwing
    return {
      data: {
        terms: [],
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      },
    };
  }
}

export const getGlossaryById = async (id: number) => {
  const url = `/glossary/terms/${id}`;
  const response = await api.get<GlossaryId>(url);
  return response;
}
