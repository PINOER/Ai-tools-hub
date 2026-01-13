import { api } from './api';

export interface ToolIndustry {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    tools: number;
  };
}

export interface ToolIndustriesResponse {
  data: ToolIndustry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ToolIndustriesParams {
  page?: number;
  limit?: number;
}

export const getToolIndustries = async (params: ToolIndustriesParams = {}): Promise<ToolIndustriesResponse> => {
  const { page = 1, limit = 10 } = params;
  
  try {
    const response = await api.get<ToolIndustriesResponse>(`/tool-industries?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Error fetching tool industries:', error);
    throw error;
  }
};