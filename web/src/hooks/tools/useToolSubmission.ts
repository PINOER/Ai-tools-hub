import React from "react";
import { useS3Upload } from "@/hooks/useS3Upload";
import { showErrorToast, showSuccessToast, showApiErrorToast } from "@/utils/toast";
import type { CreateToolForm, CreateTool } from "@/types/tools";
import { useCreateToolMutation } from "@/hooks/queries/useToolsQuery";

export const useToolSubmission = (
) => {
  const { uploadFile } = useS3Upload();
  
  // React Query mutations
  const createToolMutation = useCreateToolMutation();
  
  // State for tracking S3 upload progress
  const [isUploading, setIsUploading] = React.useState(false);

  const transformStringToArray = (str: string): string[] => {
    return str.split("\n").filter((item) => item !== "");
  };

  const createTool = async (formData: CreateToolForm) => {
    if (!formData) return false;
    
    try {
      // Set uploading state to true when starting uploads
      setIsUploading(true);
      
      // Upload avatar if it's a File object
      let avatarUrl = formData.avatar;
      if (formData.avatar && typeof formData.avatar === 'object' && 'name' in formData.avatar) {
        try {
          const avatarResult = await uploadFile(formData.avatar as File, 'tool-avatars');
          avatarUrl = avatarResult.url;
        } catch {
          showErrorToast("Failed to upload avatar image");
          setIsUploading(false);
          return false;
        }
      }

      // Upload screenshots if they are File objects
      const screenshotUrls: string[] = [];
      if (formData.screenshots && Array.isArray(formData.screenshots)) {
        for (let i = 0; i < formData.screenshots.length; i++) {
          const screenshot = formData.screenshots[i];
          if (typeof screenshot === 'object' && 'name' in screenshot) {
            try {
              const screenshotResult = await uploadFile(screenshot as File, 'tool-screenshots');
              screenshotUrls.push(screenshotResult.url);
            } catch {
              showErrorToast(`Failed to upload screenshot ${i + 1}`);
              setIsUploading(false);
              return false;
            }
          } else if (typeof screenshot === 'string') {
            screenshotUrls.push(screenshot);
          }
        }
      }

      // Create the final tool object with uploaded URLs
      const finalTool = {
        ...formData,
        avatar: avatarUrl,
        screenshots: screenshotUrls,
        features: transformStringToArray(formData.features),
        use_cases: transformStringToArray(formData.use_cases),
      };

      // Create new tool using React Query mutation
      await createToolMutation.mutateAsync({
        ...finalTool,
        tool_tags: finalTool.tool_tags, // Send as strings array
        free_plan_available: finalTool.freePlanAvailable === 'Yes',
        platform_availability: finalTool.selectedPlatforms,
      } as unknown as CreateTool);
      showSuccessToast("Tool created successfully!");
      
      // Set uploading state to false after successful submission
      setIsUploading(false);
      return true;
    } catch (error) {
      console.error('Tool submission error:', error);
      showApiErrorToast(error);
      setIsUploading(false);
      return false;
    }
  };

  // Handle mutation errors
  React.useEffect(() => {
    if (createToolMutation.error) {
      showApiErrorToast(createToolMutation.error);
    }
  }, [createToolMutation.error]);

  return { 
    createTool, 
    userHook: {
      userId: 1,
    },
    submissionLoading: createToolMutation.isPending || isUploading,
    isLoading: createToolMutation.isPending || isUploading,
    error: createToolMutation.error
  };
}; 