import type { Review } from "./reviews";

export interface User {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password?: string;
  role_id?: number;
  status: 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive';
  avatar: string | null;
  provider?: string | null;
  provider_id?: string | null;
  access_token?: string | null;
  bio?: string | null;
  moderation_notes?: string | null;
  created_at?: string;
  updated_at?: string;
  role: Role;
  reviews?: Review[];
  comments?: Comment[];
  toolSubmissions?: ToolSubmission[];
  _count?: {
    reviews: number;
    comments: number;
    toolSubmissions: number;
    tools: number;
    toolClaims: number;
  };
  // Legacy fields for backward compatibility
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  toolsSubmitted?: number;
  activityHistory?: ActivityItem[];
  repeatPassword?: string;
  sendWelcomeEmail?: boolean;
}

export interface Role {
  id: number;
  role: 'User' | 'Moderator' | 'Contributor' | 'Admin';
}

export enum UserStatus {
  Active = 'Active',
  Inactive = "Inactive",
  Pending = 'Pending',
  Banned = 'Banned',
  Suspended = "Suspended"
}

export interface ActivityItem {
  action: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  title: string;
  content: string;
  date: string;
  likes: number;
}

export interface ToolSubmission {
  id: number;
  status: string;
  internal_notes?: string;
  created_at: string;
  tool: {
    id: number;
    name: string;
    avatar: string;
  };
}