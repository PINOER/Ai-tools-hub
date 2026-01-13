import React, { JSX } from 'react';
import { StaticImageData } from 'next/image';

// Component Props Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ErrorTooltipProps {
  message?: string;
  show: boolean;
}

export interface HeadingProps {
  children: React.ReactNode;
  className?: string;
}

export interface SidebarNavItem {
  label: string;
  icon: string; // path to icon image
  selectedIcon: string; // path to selected icon image
  href: string;
  iconBg?: string;
  selectedIconBg?: string;
}

export interface SidebarSocialLink {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
  userName?: string;
  userAvatarUrl?: string;
}

export interface SidebarProps {
  bg?: string;
  collapsed?: boolean;
}

// Home API Types
export interface HomeUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar?: string;
}

export interface HomeCategory {
  id: number;
  section: string;
  name: string;
  url_slug: string;
  description: string;
  display_order: number;
  seo_title: string;
  parentCategoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface HomeNewsCategory {
  id: number;
  news_id: number;
  category_id: number;
  type: string;
  category: HomeCategory;
}

export interface HomeNews {
  id: number;
  headline: string;
  seo_title: string;
  url_slug: string;
  content: string;
  image: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  published_date: string | null;
  published_time: string | null;
  visibility: string;
  allow_comments: boolean;
  user: HomeUser;
  newsCategories: HomeNewsCategory[];
}

export interface HomeArticleCategory {
  id: number;
  article_id: number;
  category_id: number;
  type: string;
  category: HomeCategory;
}

export interface HomeArticle {
  id: number;
  headline: string;
  url_slug: string;
  content: string;
  image: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  published_date: string | null;
  published_time: string | null;
  visibility: string;
  allow_comments: boolean;
  user: HomeUser;
  articleCategories: HomeArticleCategory[];
}

export interface HomeToolCategory {
  id: number;
  tool_id: number;
  category_id: number;
  type: string;
  category: HomeCategory;
}

export interface HomeToolTag {
  tool_id: number;
  tag_id: number;
  tag: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface HomeTool {
  id: number;
  avatar: string;
  name: string;
  short_description: string;
  user_id: number | null;
  is_featured: boolean;
  is_claimed: boolean;
  status: string;
  website_url: string;
  seo_meta_title: string | null;
  seo_meta_description: string | null;
  pricing_model: string;
  free_plan_available: boolean;
  free_plan_details: string;
  paid_plan_details: string;
  platform_availability: string[];
  created_at: string;
  updated_at: string;
  full_description: string;
  use_cases: string[];
  features: string[];
  screenshots: string[];
  is_unique: boolean;
  user: HomeUser | null;
  tool_categories: HomeToolCategory[];
  tool_tags: HomeToolTag[];
  reviews: { id: number , overall_rating : number }[];
  rating: number;
}

export interface HomeApiResponse {
  success: boolean;
  data: {
    news: HomeNews[];
    articles: HomeArticle[];
    tools: HomeTool[];
  };
}

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export interface TagFilterProps {
  tags?: { id: number; label: string, Content: () => JSX.Element }[];
  activeTag: number;
  onChange: (tag: number) => void;
  color?: string;
  section?: string;
}

export interface NewsCardProps {
  id?: number;
  image: string | StaticImageData;
  title: string;
  tags?: string[];
  time?: string;
  color?: string;
  onClick?: () => void;
  url?: string;
}

export interface ToolCardProps {
  logo: string;
  name: string;
  description: string;
  tags: string[];
  stars: number;
  websiteUrl?: string;
  toolId: string | number;
  onClick?: () => void;
}

export interface SectionHeaderProps {
  icon?: React.ReactNode;
  title: string;
  className?: string;
  color?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export interface FeaturedArticleCardProps {
  image: string;
  title: string;
  tags: string[];
  time: string;
}

export interface SimilerToolType {
  name: string;
  tag: string;
  tag2?: string;
  star: number;
  color: string;
}

export interface Review {
  id: number;
  overall_rating: number;
  comment: string;
  status: string;
  created_at: string;
  tool: {
    id: number;
    name: string
    avatar: string;
  };
}

export interface Comment {
  id: number;
  comment: string;
  created_at: string;
  tool: string
}

interface ToolCategory {
  id: number;
  name: string;
}

interface ToolTag {
  id: number;
  name: string;
}

export interface ToolSubmissions {
  id: number;
  avatar: string;
  name: string;
  short_description: string;
  tool_categories: ToolCategory[];
  tool_tags: ToolTag[];
}

export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: number;
  status: string;
  avatar: string | null;
  provider: string | null;
  provider_id: string | null;
  access_token: string | null;
  bio: string | null;
  moderation_notes: string | null;
  created_at: string;
  updated_at: string;
  reviews: Review[];
  comments: Comment[];
  toolSubmissions: ToolSubmissions[]
}

export interface LoginRequest {
  first_name: string,
  last_name: string,
  email?: string,
  provider: string,
  providerId: string
}

export interface LoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  userId?: number;
  user_id?: number;
  user?: UserProfile;
  success?: boolean;
  message?: string;
}

export interface AuthContextType {
  login: (accessToken: string, refreshToken: string, userId?: number) => void;
  logout: () => void;
}

export interface FilterBarProps {
  onSearch?: (value: string) => void;
  onReset?: () => void;
  filters?: {
    roles?: number[];
    industries?: number[];
    pricing?: string[];
    platform?: string[];
    status?: string[];
    moderationStatus?: string[];
  };
  filtersData?: {
    roles?: string[];
    industries?: string[];
    pricing?: string[];
    platform?: string[];
    Status?: string[];
    moderationStatus?: string[];
  };
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  currentRange?: string;
  onPrev?: () => void;
  onNext?: () => void;
  showAiToolsControls?: boolean;
  onGridClick?: (gridLayout: number) => void;
  onAddClick?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  currentGridLayout?: number;
  selectedPricing?: string[];
  setSelectedPricing?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedPlatform?: string[];
  setSelectedPlatform?: React.Dispatch<React.SetStateAction<string[]>>;
  onSortChange?: (direction: 'asc' | 'desc') => void;
  onGridColumnClick?: () => void;
  onGridRowClick?: () => void;
  sortDirection?: "asc" | "desc";
}

export interface HomeTagFilterProps {
  tags: string[];
  activeTag: string;
  onChange: (tag: string) => void;
  color?: string;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ApiError {
  response?: {
    status: number;
    data?: unknown;
  };
  message?: string;
  code?: string;
}

export interface NewsItem {
  image: string;
  title: string;
  tags: string[];
  time: string;
  category: string;
}

export interface Article {
  image: string;
  title: string;
  tags: string[];
  time: string;
  category: string;
}

export interface ReviewsType {
  name: string;
  description: string;
}

