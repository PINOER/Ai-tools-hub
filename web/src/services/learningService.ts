import { LearningApiResponse, LearningId } from "@/types/api";
import { api } from "./api";


export const getLearning = async (page: number, limit: number, search?: string, filters?: {
    category?: number;
    status?: string;
    moderation_status?: string;
    sort_by?: 'asc' | 'desc';
}) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) {
            params.append('search', search);
        }
        if (filters?.category) {
            params.append('category_id', filters.category.toString());
        }
        if (filters?.status) {
            params.append('status', filters.status);
        }

        if (filters?.moderation_status) {
            params.append('moderation_status', filters.moderation_status);
        }
        if (filters?.sort_by) {
            params.append('sort_by', filters.sort_by);
        }
        const url = `/learnings?${params.toString()}`;
        const response = await api.get<LearningApiResponse>(url);
        const responseData = response;
        if (responseData && responseData.learnings) {
            return responseData;
        }
        return {
            learnings: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            }
        }
    } catch (error) {
        console.error('Error fetching learning:', error);
        return {
            learnings: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            }
        }
    }
}


export const getLearningById = async (id: number) => {
    const url = `/learnings/${id}`
    const response = await api.get<LearningId>(url);
    return response;
}
