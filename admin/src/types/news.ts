export enum NewsStatus {
  Published = 'Published',
  Draft = 'Draft',
  Scheduled = 'Scheduled'
}

export enum ModerationStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Rejected = 'Rejected'
}

export type NewsCategory = {
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

export type NewsCategoryRelation = {
  id: number;
  news_id: number;
  category_id: number;
  type: 'Primary' | 'Secondary';
  category: NewsCategory;
}

export type NewsUser = {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export type News = {
  id: number;
  headline: string;
  seo_title: string | null;
  url_slug: string;
  content: string;
  image: string | null;
  user_id: number;
  is_featured: boolean;
  status: NewsStatus;
  moderation_status: ModerationStatus;
  published_date: string | null;
  published_time: string | null;
  visibility: 'Public' | 'Private';
  tags: string[] | null;
  user: NewsUser;
  newsTags: any[]; // Update this based on tags structure
  newsCategories: NewsCategoryRelation[];
}

export type CreateNews = {
  headline: string;
  seo_title: string;
  url_slug: string;
  content: string;
  image: string;
  is_featured: boolean;
  status: NewsStatus;
  moderation_status: ModerationStatus;
  published_date: string;
  published_time: string;
  visibility: string;
  allow_comments: boolean;
  tags: string[];
  category_ids: number[];
  secondary_category_ids: number[];
  tag_names: string[];
};
