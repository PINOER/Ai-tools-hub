import { ClaimTool } from "@/services/toolClaim";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useS3Upload } from "@/hooks/useS3Upload";
import { showErrorToast, showSuccessToast, showApiErrorToast } from "@/utils/toast";

export const useToolClaimMutation = (id: number) => {
    const queryClient = useQueryClient();
    const { uploadFile } = useS3Upload();

    return useMutation({
        mutationFn: async (claimData: any) => {
            try {
                // Upload company ID files if they are File objects
                const companyIdUrls: string[] = [];
                if (claimData.companyId && Array.isArray(claimData.companyId)) {
                    for (let i = 0; i < claimData.companyId.length; i++) {
                        const file = claimData.companyId[i];
                        if (typeof file === 'object' && 'name' in file) {
                            try {
                                const uploadResult = await uploadFile(file as File, 'tool-claims');
                                companyIdUrls.push(uploadResult.url);
                            } catch {
                                showErrorToast(`Failed to upload company ID file ${i + 1}`);
                                throw new Error(`Failed to upload company ID file ${i + 1}`);
                            }
                        } else if (typeof file === 'string') {
                            companyIdUrls.push(file);
                        }
                    }
                }

                // Create the final claim object with uploaded URLs
                const finalClaimData = {
                    full_name: claimData.name,
                    job: claimData.job,
                    company_email: claimData.email,
                    phone: claimData.phoneNo,
                    relationship: claimData.relation.value,
                    company_website: claimData.websiteUrl,
                    tool_website: claimData.toolUrl,
                    company_image: companyIdUrls.join(','), // Convert array to comma-separated string
                    professional_profile: claimData.profile,
                    additional_information: claimData.information,
                };

                // Make API call
                const result = await ClaimTool(id, finalClaimData);
                showSuccessToast("Tool claim submitted successfully!");
                return result;
            } catch (error) {
                console.error("Error claiming tool", error);
                showApiErrorToast(error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['toolClaim'] });
        },
    });
};