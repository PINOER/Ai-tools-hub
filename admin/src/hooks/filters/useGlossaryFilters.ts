import { useState, useCallback, useMemo } from "react";
import type { GlossaryFilters } from "@/api/glossary";
import { useCategoriesQuery } from "../queries/useCategoriesQuery";

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "text" | "multiselect" | "checkbox";
  options?: { label: string; value: any }[];
}

export const useGlossaryFilters = () => {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery({ section: "Glossary", limit: 1000 });

  const [filters, setFilters] = useState<GlossaryFilters>({
    page: 1,
    limit: 10,
    category_id: undefined,
  });

  const updateFilters = useCallback((newFilters: Partial<GlossaryFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      category_id: undefined,
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatus = useCallback(
    (status: "Published" | "Draft" | "Scheduled") => {
      setFilters((prev) => ({ ...prev, status, page: 1 }));
    },
    [],
  );

  const setCategory = useCallback((category: string) => {
    // @ts-ignore
    setFilters((prev) => ({ ...prev, category_id: category, page: 1 }));
  }, []);

  const setFeatured = useCallback((featured: boolean) => {
    setFilters((prev) => ({ ...prev, featured, page: 1 }));
  }, []);

  const setModerationStatus = useCallback((moderation_status: string) => {
    setFilters((prev) => ({ ...prev, moderation_status, page: 1 }));
  }, []);

  // Ensure we have arrays for safe mapping
  const safeCategories = useMemo(() => {
    if (!categoriesData?.categories) return [];
    return Array.isArray(categoriesData.categories)
      ? categoriesData.categories
      : [];
  }, [categoriesData]);

  // Define filter options for glossary
  const filterOptions = useMemo(
    (): FilterOption[] => [
      {
        key: "search",
        label: "Search",
        type: "text",
      },
      {
        key: "category_id",
        label: "Category",
        type: "select",
        options: safeCategories.map((cat: any) => ({
          label: cat.name,
          value: cat.id,
        })),
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Published", value: "Published" },
          { label: "Draft", value: "Draft" },
          { label: "Scheduled", value: "Scheduled" },
        ],
      },
      {
        key: "featured",
        label: "Featured Only",
        type: "checkbox",
      },
      {
        key: "moderation_status",
        label: "Moderation Status",
        type: "select",
        options: [
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
          { label: "Pending", value: "Pending" },
        ],
      },
    ],
    [safeCategories],
  );
  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
    setSearch,
    setStatus,
    setCategory,
    setFeatured,
    setModerationStatus,
    filterOptions,
    isLoading: categoriesLoading,
  };
};
