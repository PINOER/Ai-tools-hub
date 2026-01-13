export interface PromptCategory {
  id: number;
  prompt_id: number;
  category_id: number;
  type: string;
  category: {
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
  };
}

export interface PromptUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface PromptVoteCount {
  votes: number;
}

export interface Prompt {
  id: number;
  title: string;
  url_slug: string;
  user_id: number;
  is_featured: boolean;
  status: 'Published' | 'Draft' | 'Scheduled';
  moderation_status: string;
  ai_models: string[];
  short_description: string;
  main_prompt: string;
  user_guide: string;
  published_date: string | null;
  published_time: string | null;
  tags: string;
  moderation_notes: string | null;
  allow_comments: boolean;
  promptCategories: PromptCategory[];
  user: PromptUser;
  promptTags: any[];
  promptChains: any[];
  _count: PromptVoteCount;
}

export interface PromptsResponse {
  data: Prompt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PromptSubmission {
  id: number;
  title: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  moderation_status?: string;
  user_id: number;
  created_at: string;
  user: PromptUser;
}