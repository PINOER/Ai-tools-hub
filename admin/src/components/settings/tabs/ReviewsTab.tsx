import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ReviewsTab = () => {
  const [formData, setFormData] = useState({
    reviewStatus: 'enabled',
    reviewApproval: 'auto-publish',
    minReviewLength: '',
    maxReviewLength: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving reviews data:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-2 block">REVIEW STATUS</Label>
        <div className="flex space-x-2">
          <Button
            variant={formData.reviewStatus === 'enabled' ? 'default' : 'outline'}
            onClick={() => handleInputChange('reviewStatus', 'enabled')}
            className={formData.reviewStatus === 'enabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Enabled
          </Button>
          <Button
            variant={formData.reviewStatus === 'disabled' ? 'default' : 'outline'}
            onClick={() => handleInputChange('reviewStatus', 'disabled')}
            className={formData.reviewStatus === 'disabled' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Disabled
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-2 block">REVIEW APPROVAL</Label>
        <div className="flex space-x-2">
          <Button
            variant={formData.reviewApproval === 'auto-publish' ? 'default' : 'outline'}
            onClick={() => handleInputChange('reviewApproval', 'auto-publish')}
            className={formData.reviewApproval === 'auto-publish' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Auto-publish new reviews
          </Button>
          <Button
            variant={formData.reviewApproval === 'require-approval' ? 'default' : 'outline'}
            onClick={() => handleInputChange('reviewApproval', 'require-approval')}
            className={formData.reviewApproval === 'require-approval' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Require admin approval
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minReviewLength" className="text-sm font-normal text-[#4D4D4D]">
            MINIMUM REVIEW LENGTH
          </Label>
          <Input
            id="minReviewLength"
            placeholder="Type"
            value={formData.minReviewLength}
            onChange={(e) => handleInputChange('minReviewLength', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="maxReviewLength" className="text-sm font-normal text-[#4D4D4D]">
            MAXIMUM REVIEW LENGTH
          </Label>
          <Input
            id="maxReviewLength"
            placeholder="Type"
            value={formData.maxReviewLength}
            onChange={(e) => handleInputChange('maxReviewLength', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};
