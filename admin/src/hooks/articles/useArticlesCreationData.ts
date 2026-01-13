import { useMemo } from "react";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";

export const useArticleCreationData = (
  categories: Category[],
  tags: Tag[],
) => {
  // Ensure we have arrays for safe mapping
  const safeCategories = useMemo(() => {
    if (!categories) return [];
    return Array.isArray(categories) ? categories : [];
  }, [categories]);

  const safeTags = useMemo(() => {
    if (!tags) return [];
    return Array.isArray(tags) ? tags : [];
  }, [tags]);

  const transformedCategories = useMemo(
    () =>
      safeCategories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    [safeCategories],
  );

  const transformedTags = useMemo(
    () =>
      safeTags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      })),
    [safeTags],
  );

  return {
    transformedCategories,
    transformedTags,
    isLoading: false, // No async data loading for article
  };
};
