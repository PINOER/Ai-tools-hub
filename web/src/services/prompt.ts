import { api } from './api';
import { PromptResponse, PromptsApiResponse } from '@/types/api';

export interface PromptsFilters {
  page: number,
  limit: number,
  search?: string,
  filters?: {
    category?: number;
    sort_by?: 'asc' | 'desc';
    status?: string;
    moderation_status?: string;
  }
}

export const getPrompts = async (filters: PromptsFilters) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());

    if (filters.search) {
      params.append('search', filters.search);
    }

    if (filters.filters?.category) {
      params.append('category_id', filters.filters.category.toString());
    }

    if (filters.filters?.sort_by) {
      params.append('sort_by', filters.filters.sort_by);
    }

    if (filters?.filters?.status) {
      params.append('status', filters.filters.status);
    }

    if (filters?.filters?.moderation_status) {
      params.append('moderation_status', filters.filters.moderation_status);
    }
    const response = await api.get<PromptsApiResponse>(
      `/prompts?${params.toString()}`
    );

    return response;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    // Return empty data instead of throwing
    return {
      data: [],
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }
}



export const getPromptById = async (id: number) => {
  const url = `/prompts/${id}`
  const response = await api.get<PromptResponse>(url);
  return response;
};

