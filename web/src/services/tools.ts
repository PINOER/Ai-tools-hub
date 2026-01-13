import { api } from './api';
import { Tool, ToolsApiResponse } from '@/types/api';
import { CreateTool, Tools } from '@/types/tools';

export const createToolsApi = async (
  data: CreateTool
): Promise<Tools> => {
  const response = await api.post<{ tool: Tools }>('/tools', data);
  return response.tool;
};

export const getTools = async (page: number, limit: number, search?: string, filters?: {
  pricing_model?: string[];
  platform_availability?: string[];
  sort_by?: 'asc' | 'desc';
  category_id?: number;
}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (search) {
      params.append('search', search);
    }

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (!value) return;

        if (Array.isArray(value) && value.length > 0) {
          // join arrays (roles=[1,2] → roles=1,2)
          params.append(key, value.join(","));
        } else if (typeof value === "string" || typeof value === "number") {
          // single values (sort_by, category_id)
          params.append(key, value.toString());
        }
      });
    }
    const url = `/tools?${params.toString()}`
    const response = await api.get<ToolsApiResponse>(url);

    // Handle different possible response structures
    const responseData = response;

    // If response is directly the data we need
    if (responseData && responseData.tools) {
      return responseData;
    }

    // Fallback with empty data
    return {
      tools: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error('Error fetching tools:', error);
    // Return empty data instead of throwing
    return {
      tools: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export const getToolById = async (id: number) => {
  const url = `/tools/${id}`
  const response = await api.get<Tool>(url);
  return response;
}

