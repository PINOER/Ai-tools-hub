import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import type { User } from '@/types/user';
import { useUpdateUserMutation } from '@/hooks/queries/useUsersQuery';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { uploadFileToS3 } from '@/lib/s3Upload';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface IFormInput {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export const EditUserDialog = ({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) => {
  const updateUserMutation = useUpdateUserMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<IFormInput>({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      email: user?.email,
      avatar: user?.avatar || undefined,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || undefined,
      });
      setAvatarUrl(user.avatar || '');
    }
  }, [user, reset]);

  const handleAvatarChange = (file: File | null) => {
    if (!file) {
      setAvatarFile(null);
      return;
    }
    setAvatarFile(file);
  };

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };



  if (!user) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
    try {
      console.log('EditUserDialog onSubmit called');
      setIsUploading(true);
      
      // Upload new avatar if selected
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        console.log('Uploading new avatar...');
        try {
          const result = await uploadFileToS3(avatarFile, 'user-avatars');
          finalAvatarUrl = result.url;
          console.log('Avatar uploaded:', finalAvatarUrl);
        } catch {
          showErrorToast('Failed to upload avatar. Please try again.');
          setIsUploading(false);
          return;
        }
      }

      const updateData = {
        id: user.id,
        data: {
          ...data,
          avatar: finalAvatarUrl,
        }
      };
      
      console.log('Calling updateUserMutation with:', updateData);
      await updateUserMutation.mutateAsync(updateData);
      
      // Only close modal and reset form on success
      reset();
      setAvatarFile(null);
      onOpenChange(false);
      showSuccessToast('User updated successfully!');
    } catch (err: any) {
      console.error('Update user error:', err);
      const errorMsg = err?.data?.message || err?.message || 'Failed to update user. Please try again.';
      showErrorToast(errorMsg);
      // Don't close modal on error - let user fix the issue
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit user details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <Label className='text-sm text-gray-500 mb-2 block'>AVATAR</Label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0] || null;
                handleAvatarChange(file);
              }}
            />
            <div className='w-[80px] h-[80px] bg-[#F2F2F2] rounded-[10px] flex items-center justify-center cursor-pointer' onClick={handleDivClick}>
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : avatarUrl ? (
                <img src={avatarUrl} alt='user-avatar' className='w-20 h-20 object-cover rounded' />
              ) : avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt='user-avatar' className='w-20 h-20 object-cover rounded' />
              ) : (
                <Upload className='w-6 h-6 text-[#CCCCCC]'/>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm text-gray-700 mb-1 block'>
                FIRST NAME <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('first_name', { required: true })}
              />
            </div>
            <div>
              <Label className='text-sm text-gray-700 mb-1 block'>
                LAST NAME <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('last_name', { required: true })}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-sm text-gray-700 mb-1 block'>
                USER NAME <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('username', { required: true })}
              />
            </div>
            <div>
              <Label className='text-sm text-gray-700 mb-1 block'>
                EMAIL <span className='text-red-500'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('email', { required: true })}
              />
            </div>
          </div>

          <div className='flex gap-3 pt-4'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending || isUploading}
            >
              Cancel
            </Button>
            <Button 
              className='flex-1' 
              type='submit'
              disabled={updateUserMutation.isPending || isUploading}
            >
              {updateUserMutation.isPending || isUploading ? (
                <div className="flex items-center gap-2">
                  <svg 
                    className="animate-spin h-4 w-4" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {isUploading ? 'Uploading avatar...' : 'Updating user...'}
                </div>
              ) : (
                'Update user'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
