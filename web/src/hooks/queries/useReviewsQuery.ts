import { getReviews } from "@/services";
import { useQuery } from "@tanstack/react-query";


export const useReviewsQuery = (page: number, limit: number) => {
    return useQuery({
        queryKey: ['reviews', page, limit],
        queryFn: () => getReviews(page, limit)
    });
}