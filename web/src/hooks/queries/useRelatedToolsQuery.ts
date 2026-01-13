import { getRelatedTools } from "@/services"
import { useQuery } from "@tanstack/react-query"


export const useRelatedToolsQuery = (entity : string, id : number) => {
    return useQuery({
        queryKey: ['relatedTools', entity, id],
        queryFn: () => getRelatedTools(entity, id),
        enabled: !!id
    })
}