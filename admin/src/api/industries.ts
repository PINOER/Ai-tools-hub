import { apiClient } from '@/lib/apiClient';

export interface Industry {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    tools: number;
  };
}

export interface IndustriesResponse {
  data: Industry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getIndustriesApi = async (): Promise<Industry[]> => {
  try {
    const response = await apiClient.get<IndustriesResponse>('/tool-industries?page=1&limit=50');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching industries:', error);
    // Return default industries if API fails
    return [
      { id: 1, name: 'Technology', createdAt: '', _count: { tools: 0 } },
      { id: 2, name: 'Healthcare', createdAt: '', _count: { tools: 0 } },
      { id: 3, name: 'Finance', createdAt: '', _count: { tools: 0 } },
      { id: 4, name: 'Education', createdAt: '', _count: { tools: 0 } },
      { id: 5, name: 'Retail', createdAt: '', _count: { tools: 0 } },
      { id: 6, name: 'Manufacturing', createdAt: '', _count: { tools: 0 } },
      { id: 7, name: 'Media & Entertainment', createdAt: '', _count: { tools: 0 } },
      { id: 8, name: 'Real Estate', createdAt: '', _count: { tools: 0 } },
      { id: 9, name: 'Transportation', createdAt: '', _count: { tools: 0 } },
      { id: 10, name: 'Energy', createdAt: '', _count: { tools: 0 } },
      { id: 11, name: 'Government', createdAt: '', _count: { tools: 0 } },
      { id: 12, name: 'Non-Profit', createdAt: '', _count: { tools: 0 } },
      { id: 13, name: 'Consulting', createdAt: '', _count: { tools: 0 } },
      { id: 14, name: 'Legal', createdAt: '', _count: { tools: 0 } },
      { id: 15, name: 'Marketing & Advertising', createdAt: '', _count: { tools: 0 } },
    ];
  }
}; 