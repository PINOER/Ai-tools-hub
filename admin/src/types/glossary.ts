export type Glossary = {
  id: number;
  term: string;
  url_slug: string;
  definition: string;
  category_id: number;
  owner: string;
  user_id: number;
  user: {
    id: number;
    username: string;
  };
  is_featured: boolean;
  status: string;
  moderation_status?: string;
  published_date?: string;
  published_time?: string;
  allow_comments: boolean;
  glossary_categories: {
    category: { id: number; name: string };
  }[];
  glossary_tags?: string[];
  secondary_category_ids: [];
};

export interface GlossaryUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface GlossarySubmission {
  id: number;
  title: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  moderation_status?: string;
  user_id: number;
  created_at: string;
  user: GlossaryUser;
}