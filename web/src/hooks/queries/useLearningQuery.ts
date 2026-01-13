import { useQuery } from "@tanstack/react-query";
import { getLearning, getLearningById } from "@/services/learningService";

export const useLearningQuery = (page: number, limit: number, search?: string, filters?: {
    category?: number;
    status?: string;
    moderation_status?: string;
    sort_by?: 'asc' | 'desc';
}) => {
    return useQuery({
        queryKey: ['learning', page, limit, search, filters],
        queryFn: () => getLearning(page, limit, search, filters),
    });
}

export const useLearningByIdQuery = (id: number) => {
    return useQuery({
        queryKey: ['learning', id],
        queryFn: () => getLearningById(id),
    });
}
