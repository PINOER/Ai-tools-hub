import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteSettingsQuery, useUpdateSiteSettingsMutation } from '@/hooks/siteSettings/useSiteSettingsQuery';
import type { UpdateSiteSettingsRequest } from '@/api/siteSettings';

export const SocialTab = () => {
  const { data: siteSettings, isLoading } = useSiteSettingsQuery();
  const { mutate: updateSiteSettings, isPending: isUpdating } = useUpdateSiteSettingsMutation();
  
  const [formData, setFormData] = useState({
    twitter: '',
    linkedin: '',
    youtube: '',
    github: ''
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        twitter: siteSettings.twitter_url || '',
        linkedin: siteSettings.linkedin_url || '',
        youtube: siteSettings.youtube_url || '',
        github: siteSettings.github_url || ''
      });
    }
  }, [siteSettings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updateData: UpdateSiteSettingsRequest = {
      twitter_url: formData.twitter,
      linkedin_url: formData.linkedin,
      youtube_url: formData.youtube,
      github_url: formData.github,
    };
    
    updateSiteSettings(updateData);
  };

  if (isLoading) {
    return <div className="space-y-6">Loading social settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="twitter" className="text-sm font-normal text-[#4D4D4D]">
            TWITTER/X
          </Label>
          <Input
            id="twitter"
            placeholder="Type"
            value={formData.twitter}
            onChange={(e) => handleInputChange('twitter', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="linkedin" className="text-sm font-normal text-[#4D4D4D]">
            LINKEDIN
          </Label>
          <Input
            id="linkedin"
            placeholder="Type"
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="youtube" className="text-sm font-normal text-[#4D4D4D]">
            YOUTUBE
          </Label>
          <Input
            id="youtube"
            placeholder="Type"
            value={formData.youtube}
            onChange={(e) => handleInputChange('youtube', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="github" className="text-sm font-normal text-[#4D4D4D]">
            GITHUB
          </Label>
          <Input
            id="github"
            placeholder="Type"
            value={formData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button 
          onClick={handleSave} 
          disabled={isUpdating}
          className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
