
import { getToolSubmissions } from "@/services";
import { useQuery } from "@tanstack/react-query";

export const useToolSubmissionQuery = (page: number, limit: number) => {

    return useQuery({
        queryKey: ['toolSubmissions', page, limit],
        queryFn: () => getToolSubmissions(page, limit)
    });
}