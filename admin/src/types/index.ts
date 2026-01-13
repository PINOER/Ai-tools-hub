export type ScreenType = 
  "tools" | "users" | "reviews" | "prompts" | "news" | "learning" | "glossary" | "categories" | "articles"

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};