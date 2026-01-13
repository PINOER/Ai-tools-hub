import React from "react";
import { useUser } from "@/hooks/useUser";
import { useS3Upload } from "@/hooks/useS3Upload";
import { showErrorToast, showApiErrorToast } from "@/lib/toast";
import type { CreateToolForm, CreateTool, Tools } from "@/types/tools";
import { useCreateToolMutation, useUpdateToolMutation } from "@/hooks/queries/useToolsQuery";

export const useToolSubmission = (
  setSubmissions?: React.Dispatch<React.SetStateAction<any[]>>,
  tool?: Tools | null
) => {
  const userHook = useUser();
  const { uploadFile } = useS3Upload();
  
  // React Query mutations
  const createToolMutation = useCreateToolMutation();
  const updateToolMutation = useUpdateToolMutation();

  const transformStringToArray = (str: string): string[] => {
    return str.split("\n").filter((item) => item !== "");
  };

  const createTool = async (formData: CreateToolForm) => {
    if (!formData) return false;
    
    try {
      // Upload avatar if it's a File object
      let avatarUrl = formData.avatar;
      if (formData.avatar && typeof formData.avatar === 'object' && 'name' in formData.avatar) {
        try {
          const avatarResult = await uploadFile(formData.avatar as File, 'tool-avatars');
          avatarUrl = avatarResult.url;
        } catch {
          showErrorToast("Failed to upload avatar image");
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

      if (tool) {
        await updateToolMutation.mutateAsync({
          id: tool.id,
          data: {
            ...finalTool,
            avatar: avatarUrl as string,
            tool_tags: finalTool.tool_tags, // Send as strings array
            free_plan_available: finalTool.freePlanAvailable === 'Yes',
            platform_availability: finalTool.selectedPlatforms,
          } as any
        });
        
        // Update submissions if provided
        if (setSubmissions) {
          setSubmissions((prevSubmissions: any[]) =>
            prevSubmissions.map((s) => s.id === tool.id ? { ...s, ...finalTool } : s)
          );
        }
      } else {
        await createToolMutation.mutateAsync({
          ...finalTool,
          tool_tags: finalTool.tool_tags, // Send as strings array
          free_plan_available: finalTool.freePlanAvailable === 'Yes',
          platform_availability: finalTool.selectedPlatforms,
        } as unknown as CreateTool);
      }
      
      return true;
    } catch (error) {
      console.error('Tool submission error:', error);
      showApiErrorToast(error);
      return false;
    }
  };

  // Handle mutation errors
  React.useEffect(() => {
    if (createToolMutation.error) {
      showApiErrorToast(createToolMutation.error);
    }
    if (updateToolMutation.error) {
      showApiErrorToast(updateToolMutation.error);
    }
  }, [createToolMutation.error, updateToolMutation.error]);

  return { 
    createTool, 
    userHook,
    isLoading: createToolMutation.isPending || updateToolMutation.isPending,
    error: createToolMutation.error || updateToolMutation.error
  };
}; 