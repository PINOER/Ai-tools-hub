import type { Category } from './categories';
import type { Tag } from './tag';

export enum ToolsStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Submitted = 'Submitted'
}

export enum PricingModel {
  Free = 'Free',
  Paid = 'Paid',
  Freemium = 'Freemium',
  Subscription = 'Subscription',
  PaidOnly = 'PaidOnly',
  OneTimePurchase = 'OneTimePurchase'
}

export enum PlatformAvailability {
  Web = 'Web',
  Desktop = 'Desktop',
  MobileApp = 'MobileApp',
  BrowserExtension = 'BrowserExtension',
  Api = 'Api'
}

export enum ToolTabs {
  Tools = 'tools',
  ToolCategories = 'tool_categories',
  ToolSubmissions = 'tool_submissions',
  ToolClaims = 'tool_claims'
}

export type Tools = {
  id: number;
  name: string;
  short_description: string;
  full_description: string;
  website_url: string;
  approved: boolean;
  user_id: number;
  status: ToolsStatus;
  avatar: string | null;
  is_featured: boolean;
  category: Category | null;
  pricing_model?: PricingModel;
  seo_meta_title?: string;
  seo_meta_description?: string;
  features?: string[];
  use_cases?: string[];
  platform_availability?: PlatformAvailability[];
  screenshots?: string[];
  is_unique: boolean;
  tool_categories: toolCategories[] | undefined;
  tool_tags: ToolTags[];
  social_links: { platform: string, url: string }[];
  free_plan_details?: string;
  paid_plan_details?: string;
  freePlanAvailable?: boolean;
};

export type toolCategories = {
  tool_id?: number;
  category_id?: number;
  category: Category;
};

export type ToolTags = {
  tool_id?: number;
  tag_id?: number;
  tag: Tag;
};

export type CreateTool = Omit<Tools, 'id' |'tool_tags'> & {
  tool_tags: string[];
}

export type CreateToolForm = {
  name: string;
  short_description: string;
  full_description: string;
  website_url: string;
  approved: boolean;
  user_id: number;
  status: ToolsStatus;
  avatar: string | File | null;
  is_featured: boolean;
  category: Category | null;
  category_id?: number; // Add category_id for API compatibility
  pricing_model?: PricingModel;
  seo_meta_title?: string;
  seo_meta_description?: string;
  features: string;
  use_cases: string;
  platform_availability?: PlatformAvailability[];
  screenshots: (string | File)[];
  is_unique: boolean;
  tool_categories: toolCategories[] | undefined;
  tool_tags: string[];
  social_links: { platform: string, url: string }[];
  free_plan_details?: string;
  paid_plan_details?: string;
  freePlanAvailable: string;
  selectedPlatforms: string[];
}

export type ToolSubmission = {
  id: number;
  tool_id: number;
  user_id: number;
  status: ToolsStatus;
  avatar: string;
  name: string;
  category: string;
  is_featured: boolean;
  tool: Tools;
  tool_categories: toolCategories[] | undefined;
  // created_at: string;
  // updated_at: string;
}

export type ToolClaim = {
  id: number;
  tool_id: number;
  claimant_id: number;
  status: ToolsStatus;
  review_notes: string | null;
  full_name: string;
  job: string;
  company_email: string;
  phone: string;
  relationship: string;
  company_website: string;
  tool_website: string;
  company_image: string;
  professional_profile: string;
  additional_information: string;
  created_at: string;
  updated_at: string;
  tool: Tools;
}