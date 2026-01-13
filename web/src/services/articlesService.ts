import { api } from './api';

export interface Article {
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
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
  };
  articleTags: {
    article_id: number,
    tag_id: number,
    tag: {
      id: number,
      name: string,
      created_at: string | null,
      updated_at: string | null
    }
  }[];
  articleCategories: {
    id: number;
    article_id: number;
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
  }[];
}

export interface ArticlesApiResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ArticlesFilters {
  page?: number;
  limit?: number;
  search?: string;
  filters?: {
    category?: number;
    sort_by?: 'asc' | 'desc';
    status?: string;
    moderation_status?: string;
  };
}

export interface ArtTags {
  article_id: number;
  tag_id: number;
  tag: {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
  };
}

export interface ArticleId {
  id: number;
  headline: string
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
  user: {
    id: number;
    username: string;
    email: string;
  };
  articleCategories: {
    id: number;
    article_id: number;
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
  }[];
  articleTags: ArtTags[];
}


export const getArticlesApi = async (filters?: ArticlesFilters) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', filters?.page?.toString() || '1');
    params.append('limit', filters?.limit?.toString() || '10');

    if (filters?.search) {
      params.append('search', filters.search);
    }

    if (filters?.filters?.category) {
      params.append('category_id', filters.filters.category.toString());
    }

    if (filters?.filters?.sort_by) {
      params.append('sort_by', filters.filters.sort_by);
    }

    if (filters?.filters?.status) {
      params.append('status', filters.filters.status);
    }

    if (filters?.filters?.moderation_status) {
      params.append('moderation_status', filters.filters.moderation_status);
    }

    const url = `/articles?${params.toString()}`;
    const response = await api.get<ArticlesApiResponse>(url);

    // Handle different possible response structures
    const responseData = response;

    // If response is directly the data we need
    if (responseData && responseData.articles) {
      return responseData;
    }

    // Fallback with empty data
    return {
      articles: [],
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty data instead of throwing
    return {
      articles: [],
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }
};

export const getArticleById = async (id: number) => {
  const url = `/articles/${id}`;
  const response = await api.get<ArticleId>(url);
  return response;
};
