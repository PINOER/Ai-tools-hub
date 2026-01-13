import { api } from './api';
import { HomeApiResponse } from '../types/components';

export interface HomeServiceParams {
  resources?: string;
  limit?: number;
  category?: number;
  search?: string;
}

export const getHomeData = async (params?: HomeServiceParams): Promise<HomeApiResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (params?.resources) queryParams.append('resources', params.resources);

    if(params?.category !== undefined && params.category >0) queryParams.append('category_id', params.category.toString());
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    if (params?.search && params.search.trim() !== '') queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `/home?${queryString}` : '/home';
    
    const response = await api.get<HomeApiResponse>(url);

    // Handle different possible response structures
    const responseData = response;

    // If response is directly the data we need
    if (responseData && responseData.success && responseData.data) {
      return responseData;
    }

    // Fallback with empty data
    return {
      success: false,
      data: {
        news: [],
        articles: [],
        tools: []
      }
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return empty data instead of throwing
    return {
      success: false,
      data: {
        news: [],
        articles: [],
        tools: []
      }
    };
  }
};
