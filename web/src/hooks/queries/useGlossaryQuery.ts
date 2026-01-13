import { getGlossaryApi, getGlossaryById, GlossaryFilters } from "@/services/glossary";
import { useQuery } from "@tanstack/react-query";


export const useGlossaryQuery = (
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters?: {
        category?: number;
        sort_by?: 'asc' | 'desc';
        status?: string;
        moderation_status?: string;
    }
) => {
    const glossaryFilters: GlossaryFilters = {
        page,
        limit,
        search,
        filters
    };

    return useQuery({
        queryKey: ['glossary', glossaryFilters],
        queryFn: () => getGlossaryApi(glossaryFilters),
    })
};

export const useGlossaryByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['glossaryId', id],
        queryFn: () => getGlossaryById(id),
    })
}

