import { api } from "./api"

export const ClaimTool = async(id : number, claimData: unknown) => {
  const url = `/tool-claims/${id}`
  const response = await api.post(url, claimData)
  return response
}