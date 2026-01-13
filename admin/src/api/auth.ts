import type { User } from '@/types/user';
import { apiClient } from '@/lib/apiClient';

export const registerUserApi = async (data: User): Promise<User> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data.data;
};

export const loginUserApi = async (data: {
  email: string;
  password: string;
}): Promise<User> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
};
