// API Types
export interface ToolCategory {
  id: number;
  tool_id: number;
  category_id: number;
  type: string;
  category: {
    name: string;
  };
}

export interface ToolTag {
  tool_id: number;
  tag_id: number;
  tag: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface SocialLink {
  id: number;
  tool_id: number;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface ToolRole {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    tools: number;
  };
}

export interface ToolRolesResponse {
  data: ToolRole[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ToolIndustry {
  id: string;
  name: string;
}

export interface ToolClaim {
  id: number;
  tool_id: number;
  claimant_id: number;
  status: string;
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
  user: {
    id: number;
    email: string;
  };
}

export interface Tool {
  id: number;
  avatar: string;
  name: string;
  short_description: string;
  user_id: number;
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
  user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  tool_categories: ToolCategory[];
  tool_tags: ToolTag[];
  tool_roles: ToolRole[];
  tool_industries: ToolIndustry[];
  social_links: SocialLink[];
  reviews: { id: number , overall_rating : number }[];
  tool_claims: ToolClaim[];
  rating?: number;
  total_reviews?: number;
}

export interface ToolsApiResponse {
  tools: Tool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ToolSubmissions {
  id: number;
  user_id: number;
  tool_id: number;
  status: string;
  internal_notes: string;
  created_at: string;
  updated_at: string;
  tool: Tool;
  user: User;
}

export interface ToolSubmissionsResponse {
  ToolSubmissions: ToolSubmissions[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ReviewImage {
  type: string;
  alt: string | null;
  image_url: string;
}

export interface ReviewHighlight {
  feature: string;
  assessment: string;
}

export interface ReviewSource {
  title: string;
  image: string;
  domain: string;
}

export interface ReviewCriteria {
  id: number;
  name: string;
  rating: number;
  comment: string;
  review_id: number;
}

export interface ReviewUser {
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
}

export interface ReviewTool {
  id: number;
  avatar: string;
  name: string;
  short_description: string;
  user_id: number;
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
}

export interface HelpfulVote {
  id: number;
  user_id: number;
  review_id: number;
  vote_type: 'helpful' | 'not_helpful';
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  id?: number;
  userId?: number;
  sub?: string | number;
  email?: string;
  username?: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

export interface Review {
  id: number;
  user_id: number;
  tool_id: number;
  overall_rating: number;
  comment: string;
  helpful_count: number;
  status: string;
  created_at: string;
  updated_at: string;
  user: ReviewUser;
  criteria: ReviewCriteria[];
  helpful_votes: HelpfulVote[];
  tool: ReviewTool;
}

export interface ReviewsApiResponse {
  [key: string]: Review;
}

export interface PostReviewCriteria {
  name: string;
  rating: number;
  comment: string;
}

export interface PostReviewRequest {
  tool_id: number;
  overall_rating: number;
  comment: string;
  criteria: PostReviewCriteria[];
}

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

export interface PromptTag {
  id: number;
  prompt_id: number;
  tag_id: number;
  tag: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

export interface PromptChain {
  id: number;
  prompt_id: number;
  chain_id: number;
  order: number;
  chain: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

export interface Prompt {
  id: number;
  title: string;
  url_slug: string;
  user_id: number;
  is_featured: boolean;
  status: string;
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
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  promptTags: PromptTag[];
  promptChains: PromptChain[];
  _count: {
    votes: number;
  };
}

export interface PromptCat {
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

export interface PromptId {
  id: number;
  title: string;
  url_slug: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  ai_models: string[];
  short_description: string;
  main_prompt: string;
  user_guide: string;
  published_date: string | null;
  published_time: string | null;
  moderation_notes: string | null;
  allow_comments: boolean;
  promptCategories: PromptCat[];
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  promptTags: any[];
  promptChains: any[];
  votes: any[]
}

export interface PromptResponse {
  success: boolean;
  message: string;
  data: PromptId;
}

export interface Bookmark {
  id: number;
  type: 'AI Tools' | 'News' | 'Articles' | 'Learning' | 'Prompts' | 'Glossary';
  title: string;
  description: string;
  tags: string[];
  rating?: number;
  url?: string;
  imageUrl?: string;
  backgroundColor?: string;
  created_at: string;
}

export interface PromptsApiResponse {
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

export interface Category {
  id: number;
  section: string;
  name: string;
  url_slug: string;
  description: string;
  display_order: number;
  seo_title: string;
  parentCategoryId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GlossaryItem {
  title: string;
  tags: string[];
  category: string;
  definition: string;
}

// New comprehensive glossary types based on actual API response
export interface GlossaryUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface GlossaryCategory {
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

export interface GlossaryTermCategory {
  id: number;
  glossary_term_id: number;
  category_id: number;
  type: 'Primary' | 'Secondary';
  category: GlossaryCategory;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  status: 'Published' | 'Draft' | 'Archived';
  moderation_status: 'Approved' | 'Pending' | 'Rejected';
  source: 'MANUAL' | 'AUTO' | 'IMPORT';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  user: GlossaryUser;
  glossary_categories: GlossaryTermCategory[];
  glossaryTags: any[]; // Array of tag objects when available
}

export interface GlossaryApiResponse {
  data: {
    terms: GlossaryTerm[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GlossaryCat {
  id: number;
  glossary_term_id: number;
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
    createdAt: string | null;
    updatedAt: string | null;
  }
}

export interface GlossaryId {
  success: boolean;
  message: string;
  data: {
    id: number;
    term: string;
    definition: string;
    status: string;
    moderation_status: string;
    source: string;
    is_featured: boolean;
    allow_comments: boolean;
    created_at: string;
    updated_at: string;
    user_id: number;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar: string;
    };
    glossary_categories: GlossaryCat[];
    glossaryTags: any[]
  }
}


// Query Keys
export const queryKeys = {
  tools: {
    all: ['tools'] as const,
    lists: () => [...queryKeys.tools.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.tools.lists(), { filters }] as const,
    details: () => [...queryKeys.tools.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.tools.details(), id] as const,
  },
  prompts: {
    all: ['prompts'] as const,
    lists: () => [...queryKeys.prompts.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.prompts.lists(), { filters }] as const,
    details: () => [...queryKeys.prompts.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.prompts.details(), id] as const,
  },
  news: {
    all: ['news'] as const,
    lists: () => [...queryKeys.news.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.news.lists(), { filters }] as const,
    details: () => [...queryKeys.news.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.news.details(), id] as const,
  },
  articles: {
    all: ['articles'] as const,
    lists: () => [...queryKeys.articles.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.articles.lists(), { filters }] as const,
    details: () => [...queryKeys.articles.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.articles.details(), id] as const,
  },
  user: (id: number) => ['user', id] as const,
  toolSubmissions: ['toolSubmissions'] as const,
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (page: number, limit: number) => [...queryKeys.notifications.lists(), page, limit] as const,
  },
} as const;

export interface NewsUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
}

export interface NewsCategory {
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

export interface NewsCategoryRelation {
  id: number;
  news_id: number;
  category_id: number;
  type: string;
  category: NewsCategory;
}

export interface NewsItem {
  id: number;
  headline: string;
  seo_title: string | null;
  url_slug: string;
  content: string;
  image: string | null;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  published_date: string | null;
  published_time: string | null;
  visibility: string;
  user: NewsUser;
  newsTags: {
    news_id: number,
    tag_id: number,
    tag: {
      id: number,
      name: string,
      created_at: string | null,
      updated_at: string | null
    }
  }[];
  newsCategories: NewsCategoryRelation[];
}

export interface NewsApiResponse {
  news: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UserNews {
  id: number
  username: string
  email: string
  avatar: string
}

export interface Cat {
  id: number
  section: string
  name: string
  url_slug: string
  description: string
  display_order: number
  seo_title: string
  parentCategoryId: number | null,
  createdAt: string
  updatedAt: string
}

export interface NewsCat {
  id: number
  news_id: number
  category_id: number
  type: string
  category: Cat
}
export interface News {
  id: number,
  headline: string,
  seo_title: string | null,
  url_slug: string,
  content: string,
  image: string | null,
  user_id: number,
  is_featured: boolean,
  status: string,
  moderation_status: string,
  published_date: string | null,
  published_time: string | null,
  visibility: string,
  allow_comments: boolean,
  user: UserNews,
  newsTags: {
    news_id: number,
    tag_id: number,
    tag: {
      id: number,
      name: string,
      created_at: string | null,
      updated_at: string | null
    }
  }[],
  newsCategories: NewsCat[]
}

export interface LearningCategory {
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

export interface LearningCategoryRelation {
  id: number;
  learning_id: number;
  category_id: number;
  type: string;
  category: LearningCategory;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LearningItem {
  id: number;
  title: string;
  url_slug: string;
  description: string;
  image: string | null;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  skill_level: string;
  lesson_link: string;
  published_date: string | null;
  published_time: string | null;
  visibility: string;
  tags: string;
  user: User;
  learningCategories: LearningCategoryRelation[];
  learningTags: any[];
}

export interface LearningApiResponse {
  learnings: LearningItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LearningId {
  id: number;
  title: string;
  url_slug: string;
  description: string;
  image: string | null;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  skill_level: string;
  lesson_link: string;
  published_date: string | null;
  published_time: string | null;
  visibility: string;
  allow_comments: boolean;
  user: {
    id: number;
    username: string;
    email: string;
  };
  learningCategories: {
    id: number;
    learning_id: number;
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
      createdAt: string | null;
      updatedAt: string | null;
    };
  }[];
  learningTags: {
    learning_id: number;
    tag_id: number;
    tag: {
      id: number;
      name: string;
      created_at: string | null;
      updated_at: string | null;
    }
  }[];
}

export interface Tools {
  id: number;
  avatar: string;
  name: string;
  short_description: string;
  user_id: number;
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
  similarity: number;
}

export interface RelatedNews {
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
  published_date: string;
  published_time: string;
  visibility: string;
  allow_comments: boolean;
  similarity: number;
}

export interface RelatedArticles {
  id: number;
  headline: string;
  url_slug: string;
  content: string;
  image: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  published_date: string;
  published_time: string | null,
  visibility: string;
  allow_comments: boolean;
  similarity: number;
}

export interface RelatedLearnings {
  id: number;
  title: string;
  url_slug: string;
  description: string;
  image: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  skill_level: string;
  lesson_link: string;
  published_date: string;
  published_time: string;
  visibility: string;
  allow_comments: boolean;
  similarity: number;
}

export interface RelatedPropmts {
  id: number;
  title: string;
  url_slug: string;
  user_id: number;
  is_featured: boolean;
  status: string;
  moderation_status: string;
  ai_models: string[],
  short_description: string;
  main_prompt: string;
  user_guide: string;
  published_date: string;
  published_time: string;
  moderation_notes: string | null,
  allow_comments: boolean;
  similarity: number;
}

export interface RelatedGlossary {
  id: number;
  term: string;
  definition: string;
  status: string;
  moderation_status: string;
  source: string;
  is_featured: boolean;
  allow_comments: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
  similarity: number;
}

export interface RelatedTools {
  tools: Tools[];
  news: RelatedNews[];
  articles: RelatedArticles[];
  learnings: RelatedLearnings[];
  prompts: RelatedPropmts[];
  glossary: RelatedGlossary[];
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  action_url: string;
  timeAgo: string;
}

export interface NotificationsApiResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  unread_count: number;
}