import { apiClient } from '@/lib/apiClient';

export interface Role {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    tools: number;
  };
}

export interface RolesResponse {
  data: Role[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getRolesApi = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get<RolesResponse>('/tool-roles?page=1&limit=50');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    // Return default roles if API fails
    return [
      { id: 1, name: 'Developer', createdAt: '', _count: { tools: 0 } },
      { id: 2, name: 'Designer', createdAt: '', _count: { tools: 0 } },
      { id: 3, name: 'Product Manager', createdAt: '', _count: { tools: 0 } },
      { id: 4, name: 'Marketer', createdAt: '', _count: { tools: 0 } },
      { id: 5, name: 'Sales', createdAt: '', _count: { tools: 0 } },
      { id: 6, name: 'Customer Support', createdAt: '', _count: { tools: 0 } },
      { id: 7, name: 'Executive', createdAt: '', _count: { tools: 0 } },
      { id: 8, name: 'Student', createdAt: '', _count: { tools: 0 } },
      { id: 9, name: 'Researcher', createdAt: '', _count: { tools: 0 } },
      { id: 10, name: 'Consultant', createdAt: '', _count: { tools: 0 } },
    ];
  }
}; 