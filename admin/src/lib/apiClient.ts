import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import { showErrorToast, formatValidationError } from "./toast";
import { useUser } from "@/hooks/useUser";
import { refreshTokenApi } from "@/api/auth";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUser.getState();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const userStore = useUser.getState();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!userStore.refreshToken) {
        userStore.logout();
        processQueue(new Error('No refresh token available'), null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        const response = await refreshTokenApi(userStore.refreshToken);
        const { accessToken, refreshToken } = response;
        
        // Update tokens in store
        userStore.setToken(accessToken);
        userStore.setRefreshToken(refreshToken);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        userStore.logout();
        processQueue(refreshError, null);
        isRefreshing = false;
        
        const message = 'Session expired. Please login again.';
        showErrorToast(message);
        
        return Promise.reject(refreshError);
      }
    }

    const errorData = error.response?.data as any;
    const message = formatValidationError(errorData) || 
                   errorData?.error || 
                   error.message || 
                   'An error occurred';
    
    if (error.response?.status !== 401) {
      showErrorToast(message);
    }

    // console.log(errorData?.message);
    
    return Promise.reject(error);
  }
);
