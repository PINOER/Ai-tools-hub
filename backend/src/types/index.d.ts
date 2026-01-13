// types/express/index.d.ts
import 'express';

declare module 'express' {
  export interface Request {
    user?: User;
    isAdmin?: boolean;
    isModerator?: boolean;
    validatedBody?: any;
    validatedParams?: any;
    validatedQuery?: any;
  }
}

export type User = {
  id: number;
  username: string;
  role: string;
};

export type CategoryWithCount = {
  id: number;
  section: string;
  name: string;
  url_slug: string;
  description?: string | null;
  display_order?: number | null;
  seo_title?: string | null;
  parentCategoryId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  items: number;
  is_parent: boolean;
  parent_category?: {
    name: string;
  } | null;
  subcategories?: {
    id: number;
  }[];
};
