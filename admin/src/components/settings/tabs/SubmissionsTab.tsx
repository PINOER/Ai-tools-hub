import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export const SubmissionsTab = () => {
  const [formData, setFormData] = useState({
    toolSubmissions: 'require-approval',
    articleSubmissions: 'require-approval',
    learningSubmissions: 'require-approval',
    adminEmail: '',
    notifications: {
      newToolSubmissions: true,
      newArticleSubmissions: true,
      newLearningSubmissions: true,
      flaggedContent: true,
      newUserRegistrations: false
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: checked
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving submissions data:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-2 block">TOOL SUBMISSIONS</Label>
        <div className="flex space-x-2">
          <Button
            variant={formData.toolSubmissions === 'require-approval' ? 'default' : 'outline'}
            onClick={() => handleInputChange('toolSubmissions', 'require-approval')}
            className={formData.toolSubmissions === 'require-approval' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Require admin approval
          </Button>
          <Button
            variant={formData.toolSubmissions === 'auto-approve' ? 'default' : 'outline'}
            onClick={() => handleInputChange('toolSubmissions', 'auto-approve')}
            className={formData.toolSubmissions === 'auto-approve' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Auto-approve
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-2 block">ARTICLE SUBMISSIONS</Label>
        <div className="flex space-x-2">
          <Button
            variant={formData.articleSubmissions === 'require-approval' ? 'default' : 'outline'}
            onClick={() => handleInputChange('articleSubmissions', 'require-approval')}
            className={formData.articleSubmissions === 'require-approval' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Require admin approval
          </Button>
          <Button
            variant={formData.articleSubmissions === 'auto-publish' ? 'default' : 'outline'}
            onClick={() => handleInputChange('articleSubmissions', 'auto-publish')}
            className={formData.articleSubmissions === 'auto-publish' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Auto-publish
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-2 block">LEARNING CONTENT SUBMISSIONS</Label>
        <div className="flex space-x-2">
          <Button
            variant={formData.learningSubmissions === 'require-approval' ? 'default' : 'outline'}
            onClick={() => handleInputChange('learningSubmissions', 'require-approval')}
            className={formData.learningSubmissions === 'require-approval' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Require admin approval
          </Button>
          <Button
            variant={formData.learningSubmissions === 'auto-publish' ? 'default' : 'outline'}
            onClick={() => handleInputChange('learningSubmissions', 'auto-publish')}
            className={formData.learningSubmissions === 'auto-publish' ? 'bg-[#4D4D4D] text-white hover:cursor-pointer py-1 px-2 h-auto' : 'hover:cursor-pointer py-1 px-2 h-auto text-[#4D4D4D]'}
          >
            Auto-publish
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="adminEmail" className="text-sm font-normal text-[#4D4D4D]">
          ADMIN NOTIFICATION EMAIL
        </Label>
        <Input
          id="adminEmail"
          placeholder="Type"
          value={formData.adminEmail}
          onChange={(e) => handleInputChange('adminEmail', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-sm font-normal text-[#4D4D4D] mb-3 block">NOTIFY ADMINS FOR</Label>
        <div className="space-y-3">
          {[
            { key: 'newToolSubmissions', label: 'New tool submissions' },
            { key: 'newArticleSubmissions', label: 'New article submissions' },
            { key: 'newLearningSubmissions', label: 'New learning content submissions' },
            { key: 'flaggedContent', label: 'Flagged content reports' },
            { key: 'newUserRegistrations', label: 'New user registrations' }
          ].map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <Checkbox
                id={item.key}
                checked={formData.notifications[item.key as keyof typeof formData.notifications]}
                onCheckedChange={(checked) => handleCheckboxChange(item.key, checked as boolean)}
              />
              <Label htmlFor={item.key} className="text-sm">
                {item.label}
              </Label>
            </div>
          ))}
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