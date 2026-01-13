import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useSiteSettingsQuery, useUpdateSiteSettingsMutation } from '@/hooks/siteSettings/useSiteSettingsQuery';
import { useS3Upload } from '@/hooks/useS3Upload';
import type { UpdateSiteSettingsRequest } from '@/api/siteSettings';

export const BrandingTab = () => {
  const { data: siteSettings, isLoading } = useSiteSettingsQuery();
  const { mutate: updateSiteSettings, isPending: isUpdating } = useUpdateSiteSettingsMutation();
  const { uploadFile, isUploading } = useS3Upload();

  const [formData, setFormData] = useState({
    favicon: '',
    socialPreview: ''
  });

  const [selectedFiles, setSelectedFiles] = useState({
    favicon: null as File | null,
    socialPreview: null as File | null
  });

  const [previewImages, setPreviewImages] = useState({
    favicon: '',
    socialPreview: ''
  });

  useEffect(() => {
    if (siteSettings) {
      setFormData({
        favicon: siteSettings.favicon || '',
        socialPreview: siteSettings.social_preview || ''
      });
      setPreviewImages({
        favicon: siteSettings.favicon || '',
        socialPreview: siteSettings.social_preview || ''
      });
    }
  }, [siteSettings]);

  const handleFileSelect = (file: File, type: 'favicon' | 'socialPreview') => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages(prev => ({ ...prev, [type]: previewUrl }));
  };


  const handleSave = async () => {
    try {
      let faviconUrl = formData.favicon;
      let socialPreviewUrl = formData.socialPreview;

      // Upload favicon if a new file is selected
      if (selectedFiles.favicon) {
        faviconUrl = await uploadFile(selectedFiles.favicon).then(res => res.url);
      }

      // Upload social preview if a new file is selected
      if (selectedFiles.socialPreview) {
        socialPreviewUrl = await uploadFile(selectedFiles.socialPreview).then(res => res.url);
      }

      const updateData: UpdateSiteSettingsRequest = {
        favicon: faviconUrl,
        social_preview: socialPreviewUrl,
      };
      
      updateSiteSettings(updateData);
      
      setFormData(prev => ({
        ...prev,
        favicon: faviconUrl,
        socialPreview: socialPreviewUrl
      }));
      setPreviewImages(prev => ({
        ...prev,
        favicon: faviconUrl,
        socialPreview: socialPreviewUrl
      }));
      setSelectedFiles({ favicon: null, socialPreview: null });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  if (isLoading) {
    return <div className="space-y-6">Loading branding settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-normal text-[#808080]">FAVICON *</Label>
        <div className="mt-2">
          <div className="relative w-20 h-20">
            {previewImages.favicon ? (
              <>
                <img 
                  src={previewImages.favicon} 
                  alt="Favicon" 
                  className="w-full h-full object-cover rounded"
                />
                </>
              ) : (
              <div className="w-full h-full bg-[#F2F2F2] rounded flex items-center justify-center">
                <Upload className="w-5 h-5 text-[#CCCCCC]" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file, 'favicon');
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>
          <div className="text-xs text-[#CCCCCC] mt-2">64×64 pixels</div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-normal text-[#808080]">SOCIAL PREVIEW *</Label>
        <div className="mt-2">
          <div className="relative w-48 h-28">
            {previewImages.socialPreview ? (
              <>
                <img 
                  src={previewImages.socialPreview} 
                  alt="Social Preview" 
                  className="w-full h-full object-cover rounded"
                />
                </>
              ) : (
              <div className="w-full h-full bg-[#F2F2F2] rounded flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#CCCCCC]" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file, 'socialPreview');
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>
          <div className="text-xs text-[#CCCCCC] mt-2">1200×630 pixels</div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button 
          onClick={handleSave} 
          disabled={isUpdating || isUploading}
          className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50"
        >
          {isUpdating ? 'Saving...' : isUploading ? 'Uploading...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};
