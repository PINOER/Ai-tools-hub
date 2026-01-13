import { JWTPayload } from '@/types/api';
import { api } from './api';
import { LoginRequest, LoginResponse, UserProfile } from '@/types/components';

// Helper function to decode JWT token (simple base64 decode of payload)
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};


export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/auth/social-login', credentials);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  // Try to get user ID from localStorage first
  const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  if (storedUserId) {
    return api.get<UserProfile>(`/users/${storedUserId}`);
  }
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded && decoded.id) {
      return api.get<UserProfile>(`/users/${decoded.id}`);
    }
    if (decoded && decoded.userId) {
      return api.get<UserProfile>(`/users/${decoded.userId}`);
    }
    if (decoded && decoded.sub) {
      return api.get<UserProfile>(`/users/${decoded.sub}`);
    }
  }
  return api.get<UserProfile>(`/users/1`);
}

export const getUserProfile = async (id: number | string) => {
  return api.get<UserProfile>(`/users/${id}`);
}

// Utility functions for authentication
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  return !!token;
};

export const getCurrentUserId = (): string | number => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    const decoded = decodeJWT(token);
    return decoded?.id || 1;
  }
  return 1;
  }


