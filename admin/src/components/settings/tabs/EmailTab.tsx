import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const EmailTab = () => {
  const [formData, setFormData] = useState({
    emailServiceProvider: '',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving email data:', formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-gray-700">EMAIL SERVICE PROVIDER</Label>
        <Select value={formData.emailServiceProvider} onValueChange={(value) => handleInputChange('emailServiceProvider', value)}>
          <SelectTrigger className="mt-1 w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smtp">SMTP</SelectItem>
            <SelectItem value="sendgrid">SendGrid</SelectItem>
            <SelectItem value="mailgun">Mailgun</SelectItem>
            <SelectItem value="ses">Amazon SES</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="smtpHost" className="text-sm font-normal text-[#4D4D4D]">
            SMTP HOST
          </Label>
          <Input
            id="smtpHost"
            placeholder="Type"
            value={formData.smtpHost}
            onChange={(e) => handleInputChange('smtpHost', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="smtpPort" className="text-sm font-normal text-[#4D4D4D]">
            SMTP PORT
          </Label>
          <Input
            id="smtpPort"
            placeholder="Type"
            value={formData.smtpPort}
            onChange={(e) => handleInputChange('smtpPort', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="smtpUsername" className="text-sm font-normal text-[#4D4D4D]">
            SMTP USERNAME
          </Label>
          <Input
            id="smtpUsername"
            placeholder="Type"
            value={formData.smtpUsername}
            onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="smtpPassword" className="text-sm font-normal text-[#4D4D4D]">
            SMTP PASSWORD/API KEY
          </Label>
          <Input
            id="smtpPassword"
            type="password"
            placeholder="Type"
            value={formData.smtpPassword}
            onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fromEmail" className="text-sm font-normal text-[#4D4D4D]">
            FROM EMAIL ADDRESS
          </Label>
          <Input
            id="fromEmail"
            type="email"
            placeholder="Type"
            value={formData.fromEmail}
            onChange={(e) => handleInputChange('fromEmail', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="fromName" className="text-sm font-normal text-[#4D4D4D]">
            FROM NAME
          </Label>
          <Input
            id="fromName"
            placeholder="Type"
            value={formData.fromName}
            onChange={(e) => handleInputChange('fromName', e.target.value)}
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