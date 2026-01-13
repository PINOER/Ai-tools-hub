import { api } from './api';
import { ToolSubmissionsResponse } from '@/types/api';

export const getToolSubmissions = async (page: number, limit: number) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const url = `/tool-submissions?${params.toString()}`
    const response = await api.get<ToolSubmissionsResponse>(url);
    return response;
  } catch (error) {
    console.error('Error fetching tool submissions:', error);
    return {
      ToolSubmissions: [],
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