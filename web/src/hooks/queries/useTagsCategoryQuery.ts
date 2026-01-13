import { getTagsCategory, TagsCategoryFilters } from "@/services/tagscategory";
import { useQuery } from "@tanstack/react-query";


export const useTagsCategoryQuery = (page: number = 1,
    limit: number = 20,
    section?: string) => {
    const filters: TagsCategoryFilters = {
        page,
        limit,
        section
    }
    return useQuery({
        queryKey: ['tags-category', filters],
        queryFn: () => getTagsCategory(filters),
    });
};
