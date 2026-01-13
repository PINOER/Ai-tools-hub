import { api } from './api';
import { NewsApiResponse, News } from '@/types/api';

export const getNews = async (page: number, limit: number, search?: string, filters?: {
  pricing_model?: string[];
  platform_availability?: string[];
  sort_by?: 'asc' | 'desc';
  category_id?: number;
  status?: string;
  moderation_status?: string;
}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (search) {
      params.append('search', search);
    }

    if (filters?.pricing_model && filters.pricing_model.length > 0) {
      params.append('pricing_model', filters.pricing_model.join(','));
    }

    if (filters?.platform_availability && filters.platform_availability.length > 0) {
      params.append('platform_availability', filters.platform_availability.join(','));
    }

    if (filters?.sort_by) {
      params.append('sort_by', filters.sort_by);
    }

    if (filters?.category_id) {
      params.append('category_id', filters.category_id.toString());
    }

    if (filters?.status) {
      params.append('status', filters.status);
    }

    if (filters?.moderation_status) {
      params.append('moderation_status', filters.moderation_status);
    }
    const url = `/news?${params.toString()}`
    const response = await api.get<NewsApiResponse>(url);

    // Handle different possible response structures
    const responseData = response;

    // If response is directly the data we need
    if (responseData && responseData.news) {
      return responseData;
    }

    // Fallback with empty data
    return {
      news: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return empty data instead of throwing
    return {
      news: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }
}

export const getNewsById = async (id: number) => {
  const url = `/news/${id}`
  const response = await api.get<News>(url);
  return response;
}