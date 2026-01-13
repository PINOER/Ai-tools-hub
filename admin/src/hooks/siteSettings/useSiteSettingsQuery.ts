import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siteSettingsApi, type UpdateSiteSettingsRequest, type SiteSettings } from '@/api/siteSettings';
import { showErrorToast, showSuccessToast } from '@/lib/toast';


export const useSiteSettingsQuery = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: siteSettingsApi.getSiteSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateSiteSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSiteSettingsRequest) => siteSettingsApi.updateSiteSettings(data),
    onSuccess: (updatedSettings: SiteSettings) => {
      queryClient.setQueryData(['siteSettings'], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ['siteSettings'] });
      showSuccessToast('Site settings updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update site settings:', error);
      showErrorToast(error?.response?.data?.message || 'Failed to update site settings');
    },
  });
};
