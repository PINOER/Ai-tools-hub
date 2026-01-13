import { postReview } from "@/services"
import { PostReviewRequest } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useReviewsMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (reviewData: PostReviewRequest) => postReview(reviewData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tool', variables.tool_id] });
            queryClient.invalidateQueries({ queryKey: ['tools'] });
        },
    })
}