import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useSiteSettingsQuery, useUpdateSiteSettingsMutation } from '@/hooks/siteSettings/useSiteSettingsQuery';
import type { UpdateSiteSettingsRequest } from '@/api/siteSettings';

export const SEOTab = () => {
  const { data: siteSettings, isLoading } = useSiteSettingsQuery();
  const { mutate: updateSiteSettings, isPending: isUpdating } = useUpdateSiteSettingsMutation();
  
  const [formData, setFormData] = useState({
    defaultMetaTitle: '',
    defaultMetaDescription: '',
    googleSearchConsole: '',
    bingWebmasterTools: '',
    sitemapSettings: {
      includeTools: true,
      includeArticles: true,
      includeNews: true,
      includeLearning: true,
      includeUserProfiles: false
    }
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        defaultMetaTitle: siteSettings.meta_title || '',
        defaultMetaDescription: siteSettings.meta_description || '',
        googleSearchConsole: siteSettings.google_search_console_verification || '',
        bingWebmasterTools: siteSettings.bing_webmaster_tools_verification || '',
        sitemapSettings: {
          includeTools: siteSettings.sitemap_settings?.includes('Tools') || false,
          includeArticles: siteSettings.sitemap_settings?.includes('Articles') || false,
          includeNews: siteSettings.sitemap_settings?.includes('News') || false,
          includeLearning: siteSettings.sitemap_settings?.includes('Learning') || false,
          includeUserProfiles: siteSettings.sitemap_settings?.includes('Users') || false
        }
      });
    }
  }, [siteSettings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sitemapSettings: {
        ...prev.sitemapSettings,
        [field]: checked
      }
    }));
  };

  const handleSave = () => {
    const sitemapSettings: string[] = [];
    if (formData.sitemapSettings.includeTools) sitemapSettings.push('Tools');
    if (formData.sitemapSettings.includeArticles) sitemapSettings.push('Articles');
    if (formData.sitemapSettings.includeNews) sitemapSettings.push('News');
    if (formData.sitemapSettings.includeLearning) sitemapSettings.push('Learning');
    if (formData.sitemapSettings.includeUserProfiles) sitemapSettings.push('Users');

    const updateData: UpdateSiteSettingsRequest = {
      meta_title: formData.defaultMetaTitle,
      meta_description: formData.defaultMetaDescription,
      google_search_console_verification: formData.googleSearchConsole,
      bing_webmaster_tools_verification: formData.bingWebmasterTools,
      sitemap_settings: sitemapSettings,
    };
    
    updateSiteSettings(updateData);
  };

  if (isLoading) {
    return <div className="space-y-6">Loading SEO settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="defaultMetaTitle" className="text-sm font-normal text-[#4D4D4D]">
          DEFAULT META TITLE
        </Label>
        <Input
          id="defaultMetaTitle"
          placeholder="Type"
          value={formData.defaultMetaTitle}
          onChange={(e) => handleInputChange('defaultMetaTitle', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="defaultMetaDescription" className="text-sm font-normal text-[#4D4D4D]">
          DEFAULT META DESCRIPTION
        </Label>
        <Textarea
          id="defaultMetaDescription"
          placeholder="Type"
          value={formData.defaultMetaDescription}
          onChange={(e) => handleInputChange('defaultMetaDescription', e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-3 block">SITEMAP SETTINGS</Label>
        <div className="space-y-3">
          {[
            { key: 'includeTools', label: 'Include tools in sitemap' },
            { key: 'includeArticles', label: 'Include articles in sitemap' },
            { key: 'includeNews', label: 'Include news in sitemap' },
            { key: 'includeLearning', label: 'Include learning content in sitemap' },
            { key: 'includeUserProfiles', label: 'Include user profiles in sitemap' }
          ].map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox
                id={item.key}
                checked={formData.sitemapSettings[item.key as keyof typeof formData.sitemapSettings]}
                onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
              />
              <Label htmlFor={item.key} className="text-sm">
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

        <div>
          <Label htmlFor="googleSearchConsole" className="text-sm font-normal text-[#4D4D4D]">
            GOOGLE SEARCH CONSOLE VERIFICATION
          </Label>
          <Input
            id="googleSearchConsole"
            placeholder="Type"
            value={formData.googleSearchConsole}
            onChange={(e) => handleInputChange('googleSearchConsole', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="bingWebmasterTools" className="text-sm font-normal text-[#4D4D4D]">
            BING WEBMASTER TOOLS VERIFICATION
          </Label>
          <Input
            id="bingWebmasterTools"
            placeholder="Type"
            value={formData.bingWebmasterTools}
            onChange={(e) => handleInputChange('bingWebmasterTools', e.target.value)}
            className="mt-1"
          />
        </div>

      <div className="flex space-x-3 pt-6">
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
