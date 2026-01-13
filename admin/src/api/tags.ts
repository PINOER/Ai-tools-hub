import type { Tag } from '@/types/tag';
import { apiClient } from '@/lib/apiClient';

export interface TagsResponse {
  tags: Tag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const getTagsApi = async (): Promise<TagsResponse> => {
  try {
    const response = await apiClient.get<TagsResponse>('/tags');
    return response.data || { tags: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { tags: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 1, hasNext: false, hasPrev: false } };
  }
};

export const createTagApi = async (
  data: Omit<Tag, 'id'>
): Promise<Tag> => {
  const response = await apiClient.post('/tags', data);
  return response.data;
};

export const deleteTagApi = async (id: number) => {
  await apiClient.delete(`/tags/${id}`);
};
