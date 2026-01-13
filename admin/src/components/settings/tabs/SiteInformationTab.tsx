import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettingsQuery, useUpdateSiteSettingsMutation } from '@/hooks/siteSettings/useSiteSettingsQuery';
import type { UpdateSiteSettingsRequest } from '@/api/siteSettings';

export const SiteInformationTab = () => {
  const { data: siteSettings, isLoading } = useSiteSettingsQuery();
  const { mutate: updateSiteSettings, isPending: isUpdating } = useUpdateSiteSettingsMutation();
  
  const [formData, setFormData] = useState({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    siteStatus: 'Live' as 'Live' | 'Maintenance',
    maintenanceMessage: ''
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        siteName: siteSettings.site_name || '',
        siteTagline: siteSettings.site_tagline || '',
        siteDescription: siteSettings.site_description || '',
        siteStatus: siteSettings.status || 'Live',
        maintenanceMessage: siteSettings.maintenance_message || ''
      });
    }
  }, [siteSettings]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updateData: UpdateSiteSettingsRequest = {
      site_name: formData.siteName,
      site_tagline: formData.siteTagline,
      site_description: formData.siteDescription,
      status: formData.siteStatus,
      maintenance_message: formData.maintenanceMessage,
    };
    
    updateSiteSettings(updateData);
  };

  if (isLoading) {
    return <div className="space-y-6">Loading site settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="siteName" className="text-sm font-normal text-[#808080]">
            SITE NAME *
          </Label>
          <Input
            id="siteName"
            placeholder="Type"
            value={formData.siteName}
            onChange={(e) => handleInputChange('siteName', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="siteTagline" className="text-sm font-normal text-[#808080]">
            SITE TAGLINE *
          </Label>
          <Input
            id="siteTagline"
            placeholder="Type"
            value={formData.siteTagline}
            onChange={(e) => handleInputChange('siteTagline', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="siteDescription" className="text-sm font-normal text-[#808080]">
          SITE DESCRIPTION *
        </Label>
        <Textarea
          id="siteDescription"
          placeholder="Type"
          value={formData.siteDescription}
          onChange={(e) => handleInputChange('siteDescription', e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-sm font-normal text-[#808080]">SITE STATUS</Label>
        <div className="flex space-x-2 mt-2">
          <Button
            variant={formData.siteStatus === 'Live' ? 'default' : 'outline'}
            onClick={() => handleInputChange('siteStatus', 'Live')}
            className={formData.siteStatus === 'Live' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-0.5 px-2 text-sm font-normal h-auto' : 'hover:cursor-pointer text-[#808080] py-0.5 px-2 h-auto text-sm font-normal'}
          >
            Live
          </Button>
          <Button
            variant={formData.siteStatus === 'Maintenance' ? 'default' : 'outline'}
            onClick={() => handleInputChange('siteStatus', 'Maintenance')}
            className={formData.siteStatus === 'Maintenance' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-0.5 px-2 text-sm font-normal h-auto' : 'hover:cursor-pointer text-[#808080] py-0.5 px-2 text-sm font-normal h-auto'}
          >
            Maintenance Mode
          </Button>
        </div>
      </div>
      {
        formData.siteStatus === 'Maintenance' && (
          <div>
            <Label htmlFor="maintenanceMessage" className="text-sm font-normal text-[#808080]">
              MAINTENANCE MESSAGE *
            </Label>
            <Textarea
              id="maintenanceMessage"
              placeholder="Type"
              value={formData.maintenanceMessage}
              onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
          )
      }
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