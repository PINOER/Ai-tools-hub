
import { getCurrentUser, getUserProfile } from "@/services"
import { useQuery } from "@tanstack/react-query"


export const useCurrentUserQuery = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => getCurrentUser()
    })
}

export const useUserProfileQuery = (id: number | string) => {
    return useQuery({
        queryKey: ['userProfile', id],
        queryFn: () => getUserProfile(id),
        enabled: !!id
    })
}