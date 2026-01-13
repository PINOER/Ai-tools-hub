import {
  ToolsStatus,
  type CreateTool,
  type ToolClaim,
  type Tools,
  type ToolSubmission,
} from '@/types/tools';
import { apiClient } from '@/lib/apiClient';

// TOOLS
export const getToolsApi = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    tag_ids?: number[];
    status?: string;
    pricing_model?: string;
    platform_availability?: string[];
    is_featured?: boolean;
    is_claimed?: boolean;
  }
): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
  if (params?.tag_ids && params.tag_ids.length > 0) {
    queryParams.append('tag_ids', params.tag_ids.join(','));
  }
  if (params?.status) queryParams.append('status', params.status);
  if (params?.pricing_model) queryParams.append('pricing_model', params.pricing_model);
  if (params?.platform_availability && params.platform_availability.length > 0) {
    queryParams.append('platform_availability', params.platform_availability.join(','));
  }
  if (params?.is_featured !== undefined) queryParams.append('is_featured', params.is_featured.toString());
  if (params?.is_claimed !== undefined) queryParams.append('is_claimed', params.is_claimed.toString());

  const url = `/tools${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient.get<{data: any}>(url);
  return response;
};

export const createToolsApi = async (
  data: CreateTool
): Promise<Tools> => {
  const response = await apiClient.post('/tools', data);
  return response.data.data;
};

export const deleteToolsApi = async (id: number) => {
  await apiClient.delete(`/tools/${id}`);
};

export const updateToolsApi = async (
  id: number,
  data: Partial<Tools>
) => {
  await apiClient.patch(`/tools/${id}`, data);
};

export const deleteMultipleToolsApi = async (ids: number[]) => {
  await apiClient.post(
    `/tools/bulk-delete`,
    { tool_ids: ids }
  );
};

// TOOL CLAIMS
export const getToolClaimsApi = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }
): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);

  const url = `/tool-claims${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient.get<{data: any}>(url);
  return response;
};

export const updateToolClaimStatusApi = async (
  id: number,
  status: ToolsStatus
): Promise<ToolClaim> => {
  const response = await apiClient.patch(
    `/tool-claims/${id}/approve`,
    { status }
  );

  return response.data.data;
};

export const updateMultipleToolClaimsStatusApi = async (
  ids: number[],
  status: ToolsStatus
) => {
  await apiClient.patch(
    `/tool-claims/status/bulk-update`,
    {
      claims: ids.map((id) => {
        return { id, status };
      }),
    }
  );
};

export const deleteToolClaimApi = async (
  id: number
): Promise<ToolClaim> => {
  const response = await apiClient.delete(
    `/tool-claims/${id}`
  );

  return response.data.data;
};

export const deleteMultipleToolClaimsApi = async (ids: number[]) => {
  await apiClient.post(
    `/tool-claims/bulk-delete`,
    { claim_ids: ids }
  );
};


// TOOL SUBMISSIONS
export const getToolSubmissionsApi = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    user_id?: number;
  }
): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.user_id) queryParams.append('user_id', params.user_id.toString());

  const url = `/tool-submissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient.get<{data: any}>(url);
  return response.data;
};

export const updateMultipleToolSubmissionsStatusApi = async (
  ids: number[],
  status: ToolsStatus
) => {
  await apiClient.patch(
    `/tool-submissions/status/bulk-update`,
    {
      submissions: ids.map((id) => {
        return { id, status };
      }),
    }
  );
};

export const approveMultipleToolSubmissionsApi = async (
  ids: number[]
) => {
  return updateMultipleToolSubmissionsStatusApi(ids, ToolsStatus.Approved);
};

export const updateToolSubmissionStatusApi = async (
  id: number,
  status: ToolsStatus
): Promise<ToolSubmission> => {
  const response = await apiClient.patch(
    `/tool-submissions/${id}`,
    { status }
  );

  return response.data.data;
};

export const approveToolSubmissionApi = async (
  id: number
): Promise<ToolSubmission> => {
  return updateToolSubmissionStatusApi(id, ToolsStatus.Approved);
};

export const deleteToolSubmissionApi = async (id: number) => {
  await apiClient.delete(`/tool-submissions/${id}`);
};

export const deleteMultipleToolSubmissionsApi = async (ids: number[]) => {
  await apiClient.post(
    `/tool-submissions/bulk-delete`,
    { submission_ids: ids }
  );
};

// TOOL CATEGORIES
export const deleteToolCategoryApi = async (id: number) => {
  await apiClient.delete(`/categories/${id}/section-categories?section=Tool`);
};

export const deleteMultipleToolCategoriesApi = async (ids: number[]) => {
  await apiClient.post(
    `/categories/bulk-delete-section-categories`,
    { 
      categoryIds: ids,
      section: "Tool"
    }
  );
};
