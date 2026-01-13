import { login } from "@/services"
import { LoginRequest } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export const useLoginMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (credentials: LoginRequest) => login(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tools'] });
        }
    })
}