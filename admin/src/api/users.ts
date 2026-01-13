import { apiClient } from '@/lib/apiClient';
import { UserStatus, type User } from '@/types/user';

export const getUsersApi = async (
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
    is_active?: boolean;
    created_at?: string;
  }
): Promise<any> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.role) queryParams.append('role', params.role);
  if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
  if (params?.created_at) queryParams.append('created_at', params.created_at);

  const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await apiClient.get<any>(url);
  return response.data;
};

export const getUserByIdApi = async (id: number): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};


export const checkUsernameApi = async (username: string): Promise<{ username: string; exists: boolean; available: boolean }> => {
  const response = await apiClient.post('/users/check-username', { username });
  return response.data;
};

export const createUserApi = async (
  data: Omit<User, 'id'>
): Promise<{user: User, token: string}> => {
  const response = await apiClient.post('/users', data);
  return response.data.data;
};

export const updateUserApi = async (
  id: number,
  data: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: 'User' | 'Moderator' | 'Contributor' | 'Admin';
    status?: 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive';
    avatar?: string;
    provider?: string;
    provider_id?: string;
    access_token?: string;
    bio?: string;
    moderation_notes?: string;
  }
): Promise<User> => {
  const response = await apiClient.patch(`/users/${id}`, data);

  return response.data.data;
};

export const deleteUserApi = async (id: number) => {
  await apiClient.delete(`/users/${id}`);
};

export const activateUserApi = async (user: User): Promise<User> => {
  const response = await apiClient.patch(
    `/users/${user.id}`,
    { status: UserStatus.Active, moderation_notes: '', provider: '' }
  );

  return response.data.data;
};

export const banUserApi = async (user: User): Promise<User> => {
  const response = await apiClient.patch(
    `/users/${user.id}`,
    { status: UserStatus.Banned, moderation_notes: '', provider: '' }
  );

  return response.data.data;
};

export const suspendUserApi = async (
  user: User
): Promise<User> => {
  const response = await apiClient.patch(
    `/users/${user.id}`,
    { status: UserStatus.Suspended, moderation_notes: '', provider: '' }
  );

  return response.data.data;
};

export const activateMultipleUsersApi = async (ids: number[]) => {
  await apiClient.patch(
    `/users/status/bulk-update`,
    {
      users: ids.map((id) => {
        return { id, status: UserStatus.Active };
      }),
    }
  );
};

export const banMultipleUsersApi = async (ids: number[]) => {
  await apiClient.patch(
    `/users/status/bulk-update`,
    {
      users: ids.map((id) => {
        return { id, status: UserStatus.Banned };
      }),
    }
  );
};

export const suspendMultipleUsersApi = async (ids: number[]) => {
  await apiClient.patch(
    `/users/status/bulk-update`,
    {
      users: ids.map((id) => {
        return { id, status: UserStatus.Suspended };
      }),
    }
  );
};

export const deleteMultipleUsersApi = async (ids: number[]) => {
  await apiClient.post(
    `/users/bulk-delete`,
    {
      ids,
    }
  );
};

export const updateProfileApi = async (
  userId: number,
  data: {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    role?: 'User' | 'Moderator' | 'Contributor' | 'Admin';
    status?: 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive';
    avatar?: string;
    bio?: string;
    moderation_notes?: string;
  }
): Promise<User> => {
  const response = await apiClient.patch(`/users/${userId}`, data);
  return response.data.data;
};