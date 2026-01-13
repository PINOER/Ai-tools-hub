import { useState, useCallback, useMemo } from "react";
import type { PromptsFilters } from "@/api/prompts";
import { useCategoriesQuery } from "../queries/useCategoriesQuery";
import type { FilterOption } from "./useNewsFilters";

export const usePromptsFilters = () => {
  const { data: categoriesData } = useCategoriesQuery({
    section: "Prompt",
    limit: 1000,
  });


  const [filters, setFilters] = useState<PromptsFilters>({
    page: 1,
    limit: 10,
  });

  const updateFilters = useCallback((newFilters: Partial<PromptsFilters>) => {
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
    []
  );

  const setCategory = useCallback((category_id: string) => {
    setFilters((prev) => ({ ...prev, category_id, page: 1 }));
  }, []);

  const setFeatured = useCallback((featured: boolean) => {
    setFilters((prev) => ({ ...prev, featured, page: 1 }));
  }, []);

  const setModerationStatus = useCallback((moderation_status: string) => {
    setFilters((prev) => ({ ...prev, moderation_status, page: 1 }));
  }, []);

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
        options: categoriesData?.categories.map((cat: any) => ({
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
    [categoriesData]
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
    filterOptions
  };
};
