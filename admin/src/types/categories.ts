export type Category = {
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
  parent_category: {
    name: string;
  } | null;
  items: number;
  subcategories?: Category[];
};
