import { api } from './api';

export interface ToolRole {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    tools: number;
  };
}

export interface ToolRolesResponse {
  data: ToolRole[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ToolRolesParams {
  page?: number;
  limit?: number;
}

export const getToolRoles = async (params: ToolRolesParams = {}): Promise<ToolRolesResponse> => {
  const { page = 1, limit = 10 } = params;
  
  try {
    const response = await api.get<ToolRolesResponse>(`/tool-roles?page=${page}&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Error fetching tool roles:', error);
    throw error;
  }
};