import { RelatedTools } from "@/types/api"
import { api } from "./api"


export const getRelatedTools = async(entity : string, id : number) => {
  const url = `/related/${entity}/${id}`
  const response = await api.get<RelatedTools>(url) 
  return response
}