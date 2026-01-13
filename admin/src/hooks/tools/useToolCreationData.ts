import { useMemo } from "react";
import { useRolesQuery } from "@/hooks/queries/useRolesQuery";
import { useIndustriesQuery } from "@/hooks/queries/useIndustriesQuery";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";

export const useToolCreationData = (categories: Category[], tags: Tag[]) => {
  const { data: rolesData, isLoading: rolesLoading } = useRolesQuery();
  const { data: industriesData, isLoading: industriesLoading } = useIndustriesQuery();

  // Check if any data is still loading
  const isLoading = rolesLoading || industriesLoading;

  // Ensure we have arrays for safe mapping
  const safeCategories = useMemo(() => {
    if (!categories) return [];
    return Array.isArray(categories) ? categories : [];
  }, [categories]);

  const safeTags = useMemo(() => {
    if (!tags) return [];
    return Array.isArray(tags) ? tags : [];
  }, [tags]);

  const transformedCategories = useMemo(() => 
    safeCategories.map((category) => ({
      label: category.name,
      value: category.id,
    })), [safeCategories]
  );

  const transformedTags = useMemo(() => 
    safeTags.map((tag) => ({
      value: tag.id,
      label: tag.name,
    })), [safeTags]
  );

  const transformedRoles = useMemo(() => 
    rolesData?.map((role) => ({ 
      label: role.name, 
      value: role.id 
    })) || [], [rolesData]
  );

  const transformedIndustries = useMemo(() => 
    industriesData?.map((industry) => ({
      label: industry.name,
      value: industry.id,
    })) || [], [industriesData]
  );

  return {
    transformedCategories,
    transformedTags,
    transformedRoles,
    transformedIndustries,
    isLoading,
  };
}; 