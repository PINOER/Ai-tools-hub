import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { useUpdateProfileMutation } from '@/hooks/queries/useUsersQuery';
import { useS3Upload } from '@/hooks/useS3Upload';
import { useUser } from '@/hooks/useUser';

export const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role: 'User' as 'User' | 'Moderator' | 'Contributor' | 'Admin',
    status: 'Active' as 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive',
    password: '',
    avatar: '',
    bio: ''
  });
  

  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateProfileMutation = useUpdateProfileMutation();
  const { uploadFile, isUploading } = useS3Upload();
  const user = useUser();

  // Load existing user data when component mounts
  useEffect(() => {
    if (user.userId) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        role: user.role?.role as 'User' | 'Moderator' | 'Contributor' | 'Admin' || 'User',
        status: user.status as 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive' || 'Active',
        password: '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
      
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setAvatarPreview('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      let avatarUrl = formData.avatar;

      // Upload file if a new file is selected
      if (selectedFile) {
        const result = await uploadFile(selectedFile, 'user-avatars');
        avatarUrl = result.url;
      }

      const updateData = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar: avatarUrl,
        bio: formData.bio,
        ...(formData.password && { password: formData.password })
      };

      await updateProfileMutation.mutateAsync({
        userId: user.userId!,
        data: updateData
      });
      
      // Update user hook with new data
      user.setUserData({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        role: { id: user.role?.id || 0, role: formData.role },
        status: formData.status,
        avatar: avatarUrl,
        bio: formData.bio,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!user.userId) {
    return (
      <div className="py-6 px-10 space-y-6 bg-white rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Please log in to view profile settings.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-10 space-y-6 bg-white rounded-lg">
        <div className="space-y-6">
          {/* Avatar Section */}
          <div>
            <Label className="text-sm font-normal text-[#808080]">AVATAR</Label>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-20 h-20 bg-[#F2F2F2] rounded-lg flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-[#CCCCCC]" />
                )}
              </div>
              <div className="space-y-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  type="button"
                  variant="outline" 
                  className="text-gray-600 px-4 py-1 showdow-none h-auto block hover:cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload new
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="text-gray-600 px-4 py-1 showdow-none h-auto block hover:cursor-pointer"
                  onClick={handleRemoveAvatar}
                  disabled={!avatarPreview}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-sm font-normal text-[#808080]">
                FIRST NAME *
              </Label>
              <Input
                id="first_name"
                placeholder="Type"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="last_name" className="text-sm font-normal text-[#808080]">
                LAST NAME *
              </Label>
              <Input
                id="last_name"
                placeholder="Type"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Username and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-sm font-normal text-[#808080]">
                USER NAME *
              </Label>
              <Input
                id="username"
                placeholder="Type"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-normal text-[#808080]">
                EMAIL *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Type"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-normal text-[#808080]">ROLE</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Contributor">Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-normal text-[#808080]">STATUS</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <span className="text-green-600">Active</span>
                  </SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Banned">Banned</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password" className="text-sm font-normal text-[#808080]">
                PASSWORD
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Type"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="text-sm font-normal text-[#4D4D4D] px-4 py-1 showdow-none h-auto block hover:cursor-pointer">
                Change password
              </Button>
            </div>
          </div>
        </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button 
          onClick={handleSave} 
          disabled={updateProfileMutation.isPending || isUploading}
          className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer disabled:opacity-50"
        >
          {updateProfileMutation.isPending || isUploading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};