import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const AnalyticsTab = () => {
  const [formData, setFormData] = useState({
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving analytics data:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="googleAnalyticsId" className="text-sm font-normal text-[#4D4D4D]">
          GOOGLE ANALYTICS ID
        </Label>
        <Input
          id="googleAnalyticsId"
          placeholder="Type"
          value={formData.googleAnalyticsId}
          onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="googleTagManagerId" className="text-sm font-normal text-[#4D4D4D]">
          GOOGLE TAG MANAGER ID
        </Label>
        <Input
          id="googleTagManagerId"
          placeholder="Type"
          value={formData.googleTagManagerId}
          onChange={(e) => handleInputChange('googleTagManagerId', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="facebookPixelId" className="text-sm font-normal text-[#4D4D4D]">
          FACEBOOK PIXEL ID
        </Label>
        <Input
          id="facebookPixelId"
          placeholder="Type"
          value={formData.facebookPixelId}
          onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};