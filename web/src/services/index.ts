// Export all services
export { api, apiClient } from './api';

// Export React Query hooks from services
export {
  login,
  getCurrentUser,
  getUserProfile,
  logout,
  isAuthenticated
} from './userService';

export {
  getPrompts,
  getPromptById
} from './prompt';

export {
  getTools,
  getToolById
} from './tools';

export {
  getTools as useToolsList
} from './tools';

export {
  getTagsCategory
} from './tagscategory';

export {
  getArticlesApi
} from './articlesService';

export {
  getReviews,
  postReview
} from './reviews';

export {
  getToolSubmissions
} from './toolSubmissions';

export {
  getRelatedTools
} from './relatedTools';

export {
  getHomeData
} from './homeService';

export {
  getToolRoles
} from './toolRolesService';

export {
  getToolIndustries
} from './toolIndustriesService';

export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from './notificationsService';

// Export types
export type { AxiosRequestConfig, AxiosResponse } from './api';
export type { HomeServiceParams } from './homeService';
export type { ToolRolesParams, ToolRole, ToolRolesResponse } from './toolRolesService';
export type { ToolIndustriesParams, ToolIndustry, ToolIndustriesResponse } from './toolIndustriesService';
export type { 
  HomeApiResponse,
  HomeUser, 
  HomeCategory, 
  HomeNews, 
  HomeArticle, 
  HomeTool 
} from '../types/components'; 
