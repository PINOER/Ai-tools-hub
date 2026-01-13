export enum LearningStatus {
  Published = 'Published',
  Draft = 'Draft',
  Schedule = 'Schedule',
}

export type Learning = {
  id: number;
  title: string;
  url_slug: string;
  description: string;
  approved: boolean;
  is_featured: boolean;
  owner: string;
  lesson_link: string;
  user_id: number;
  user: {
    id: number;
    username: string;
  };
  allow_comments: boolean;
  date?: Date;
  time?: string;
  content: string;
  image: string;
  categories?: string[];
  learningCategories: {
    category: { id: number; name: string };
  }[];
  learningTags: string[];
  secondary_category_ids: [];
  status: LearningStatus;
  moderation_status?: string;
  published_date?: string
  published_time?: string;
};

export interface LearningUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface LearningSubmission {
  id: number;
  title: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  image: string | null;
  moderation_status?: string;
  user_id: number;
  created_at: string;
  user: LearningUser;
}
