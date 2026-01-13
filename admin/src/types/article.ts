export enum ArticleStatus {
  Published = 'Published',
  Draft = 'Draft',
  Schedule = 'Schedule',
}

export type Article = {
  id: number;
  headline: string;
  url_slug: string;
  content: string;
  is_featured: boolean;
  image: string | null;
  category_id: number;
  user_id: number;
  user: {
    id: number;
    username: string;
  };
  moderation_status?: string;
  published_date?: string;
  published_time?: string;
  allow_comments: boolean;
  featured_on_homepage: false,
  include_in_newsletter: false,
  articleCategories: {
    category: { id: number; name: string };
  }[];
  articleTags: string[];
  secondary_category_ids: [];
  status: ArticleStatus;
}

export interface ArticleUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface ArticleSubmission {
  id: number;
  headline: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  image: string;
  moderation_status?: string;
  user_id: number;
  created_at: string;
  user: ArticleUser;
}
