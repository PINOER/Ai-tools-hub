import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateUserMutation, useCheckUsernameQuery } from '@/hooks/queries/useUsersQuery';
import { useRef, useEffect, useState } from 'react';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { createUserSchema, type CreateUserFormData, RoleType } from '@/lib/validations/user';
import { UserStatus } from '@/types/user';
import { uploadFileToS3 } from '@/lib/s3Upload';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateUserDialog = ({
  open,
  onOpenChange,
}: CreateUserDialogProps) => {
  const fileLogoInputRef = useRef<HTMLInputElement>(null);
  const createUserMutation = useCreateUserMutation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState<string>('');
  
  // Handle mutation errors with toast
  useEffect(() => {
    if (createUserMutation.error) {
      const errorMsg = createUserMutation.error.message || 'Failed to create user. Please try again.';
      showErrorToast(errorMsg);
    }
  }, [createUserMutation.error]);

  const { register, handleSubmit, reset, control, formState: { errors }, watch, clearErrors, trigger } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    mode: 'onBlur',
    defaultValues: {
      avatar: '',
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      role: RoleType.User,
      status: UserStatus.Active,
      bio: '',
      password: '',
      repeatPassword: '',
      moderation_notes: '',
      sendWelcomeEmail: true,
      provider: '',
      provider_id: '',
      access_token: '',
    },
  });

  const watchedUsername = watch('username');
  const hasUsernameError = !!errors.username;
  
  // Debounce username check
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [watchedUsername]);

  const usernameCheck = useCheckUsernameQuery(debouncedUsername, !hasUsernameError);

  // Reset form and errors when modal closes
  const handleModalClose = (open: boolean) => {
    if (!open) {
      reset();
      clearErrors();
      createUserMutation.reset();
      setAvatarFile(null);
      setAvatarUrl('');
    }
    onOpenChange(open);
  };

  const onSubmit: SubmitHandler<CreateUserFormData> = async (data: any) => {
    try {
      
      const validationErrors = Object.keys(errors);
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map(field => {
          const error = errors[field as keyof typeof errors];
          return error?.message?.toString() || `${field} is required`;
        });
        
        // Show first validation error as toast
        showErrorToast(errorMessages[0]);
        return;
      }
      
      setIsUploading(true);
      
      let avatarUrl = "";
      try {
        if (!avatarFile) {
          showErrorToast('Avatar is required');
          return;
        }
        const result = await uploadFileToS3(avatarFile, 'user-avatars');
        avatarUrl = result.url;
      } catch {
        showErrorToast('Failed to upload avatar. Please try again.');
        return;
      }

      const userData = {
        ...data, 
        avatar: avatarUrl, 
        provider: '', 
        provider_id: '', 
        access_token: ''
      };
      
      console.log('User data to send:', userData);
      await createUserMutation.mutateAsync(userData);
      
      reset();
      setAvatarFile(null);
      setAvatarUrl('');
      onOpenChange(false);
      showSuccessToast('User created successfully!');
    } catch (err: any) {
      console.error('Create user error:', err);
      const errorMsg = err?.data?.message || err?.message || 'Failed to create user. Please try again.';
      showErrorToast(errorMsg);
      // Don't close modal on error - let user fix the issue
    } finally {
      setIsUploading(false);
    }
  };

  const handleDivClick = () => {
    fileLogoInputRef.current?.click();
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) {
      setAvatarFile(null);
      setAvatarUrl('');
      return;
    }
    setAvatarFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className='md:max-w-5xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-[#00000033] text-[27px] font-normal'>Create user</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <Label className='text-[14px] text-[#808080] mb-2 block'>AVATAR <span className='text-[14px] text-[#4D4D4D]'>*</span></Label>
            <Controller
              control={control}
              name="avatar"
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileLogoInputRef}
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      handleAvatarChange(file);
                    }}
                    onBlur={() => trigger('avatar')}
                  />
                  <div className={`flex items-center justify-center rounded-md bg-[#F2F2F2] w-[80px] h-[80px] cursor-pointer ${errors?.avatar ? 'border-2 border-red-500' : ''}`} onClick={handleDivClick}>
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
                      <svg
                        width='24'
                        height='28'
                        viewBox='0 0 16 20'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='cursor-pointer'
                      >
                        <path
                          d='M2.90265 20C1.9469 20 1.22419 19.7611 0.734513 19.2832C0.244838 18.8054 0 18.0973 0 17.1591V8.55769C0 7.62529 0.244838 6.92016 0.734513 6.44231C1.22419 5.95862 1.9469 5.71678 2.90265 5.71678H5.46903V7.43881H3.00885C2.59587 7.43881 2.28024 7.54662 2.06195 7.76224C1.84956 7.97203 1.74336 8.28963 1.74336 8.71504V17.0105C1.74336 17.4359 1.84956 17.7535 2.06195 17.9633C2.28024 18.1789 2.59587 18.2867 3.00885 18.2867H12.9823C13.3894 18.2867 13.7021 18.1789 13.9204 17.9633C14.1445 17.7535 14.2566 17.4359 14.2566 17.0105V8.71504C14.2566 8.28963 14.1445 7.97203 13.9204 7.76224C13.7021 7.54662 13.3894 7.43881 12.9823 7.43881H10.531V5.71678H13.0973C14.0531 5.71678 14.7758 5.95862 15.2655 6.44231C15.7552 6.92016 16 7.62529 16 8.55769V17.1591C16 18.0915 15.7552 18.7966 15.2655 19.2745C14.7758 19.7582 14.0531 20 13.0973 20H2.90265ZM8 13.0332C7.77581 13.0332 7.58112 12.9545 7.41593 12.7972C7.25664 12.6399 7.17699 12.4534 7.17699 12.2378V3.43531L7.24779 2.13287L6.69027 2.77098L5.45133 4.08217C5.30973 4.23951 5.12684 4.31818 4.90265 4.31818C4.69617 4.31818 4.52212 4.25408 4.38053 4.12587C4.24484 3.99184 4.17699 3.82284 4.17699 3.61888C4.17699 3.4324 4.25074 3.26049 4.39823 3.10315L7.37168 0.27972C7.48378 0.174825 7.58997 0.101981 7.69027 0.0611888C7.79056 0.0203963 7.89381 0 8 0C8.10619 0 8.20944 0.0203963 8.30973 0.0611888C8.41003 0.101981 8.51327 0.174825 8.61947 0.27972L11.5929 3.10315C11.7463 3.26049 11.823 3.4324 11.823 3.61888C11.823 3.82284 11.7493 3.99184 11.6018 4.12587C11.4602 4.25408 11.2891 4.31818 11.0885 4.31818C10.8702 4.31818 10.6873 4.23951 10.5398 4.08217L9.30089 2.77098L8.75221 2.13287L8.82301 3.43531V12.2378C8.82301 12.4534 8.74041 12.6399 8.57522 12.7972C8.41593 12.9545 8.22419 13.0332 8 13.0332Z'
                          fill='#CCCCCC'
                        />
                      </svg>
                    )}
                  </div>
                  {errors?.avatar && <p className='text-red-500 text-sm mt-1'>{errors.avatar.message?.toString()}</p>}
                </>
              )}
            />
          </div>

          {/* Name fields */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                FIRST NAME <span className='text-[14px] text-[#4D4D4D]'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('first_name', { 
                  required: true,
                  onBlur: () => trigger('first_name')
                })}
              />
              {errors.first_name && <p className='text-red-500 text-sm'>{errors.first_name.message?.toString()}</p>}
            </div>
            <div>
              <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                LAST NAME <span className='text-[14px] text-[#4D4D4D]'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('last_name', { 
                  required: true,
                  onBlur: () => trigger('last_name')
                })}
              />
              {errors.last_name && <p className='text-red-500 text-sm'>{errors.last_name.message?.toString()}</p>}
            </div>
          </div>

          {/* Username and Email */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                USER NAME <span className='text-[14px] text-[#4D4D4D]'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('username', { 
                  required: true,
                  onBlur: () => trigger('username')
                })}
              />
              {errors.username && <p className='text-red-500 text-sm'>{errors.username.message?.toString()}</p>}
              {!hasUsernameError && usernameCheck.data && !usernameCheck.data.available && debouncedUsername.length >= 3 && (
                <p className='text-red-500 text-sm'>Username already exists</p>
              )}
              {!hasUsernameError && usernameCheck.data && usernameCheck.data.available && debouncedUsername.length >= 3 && (
                <p className='text-green-500 text-sm'>Username is available</p>
              )}
            </div>
            <div>
              <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                EMAIL <span className='text-[14px] text-[#4D4D4D]'>*</span>
              </Label>
              <Input
                placeholder='Type'
                {...register('email', { 
                  required: true,
                  onBlur: () => trigger('email')
                })}
              />
              {errors.email && <p className='text-red-500 text-sm'>{errors.email.message?.toString()}</p>}
            </div>
          </div>

          {/* Role and Status */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='w-full'>
              <Controller
                control={control}
                name='role'
                render={({ field }) => (
                  <div className='w-full'>
                    <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                      ROLE
                    </Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='User'>User</SelectItem>
                        <SelectItem value='Moderator'>Moderator</SelectItem>
                        <SelectItem value='Admin'>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
            <div className='w-full'>
              <Controller
                control={control}
                name='status'
                render={({ field }) => {
                  const getStatusColor = (status: string) => {
                    switch (status) {
                      case 'Active':
                        return 'text-[#34C759]';
                      case 'Pending':
                        return 'text-[#FF9500]';
                      case 'Inactive':
                        return 'text-[#FF3B30]';
                      default:
                        return 'text-gray-700';
                    }
                  };

                  return (
                    <div className='w-full'>
                      <Label className='text-sm text-gray-700 mb-1 block'>
                        STATUS
                      </Label>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='w-full'>
                          <SelectValue>
                            {field.value && (
                              <span className={getStatusColor(field.value)}>
                                {field.value}
                              </span>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Active'>
                            <span className='text-[#34C759]'>Active</span>
                          </SelectItem>
                          <SelectItem value='Pending'>
                            <span className='text-[#FF9500]'>Pending</span>
                          </SelectItem>
                          <SelectItem value='Inactive'>
                            <span className='text-[#FF3B30]'>Inactive</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label className='text-sm text-gray-700 mb-1 block'>BIO</Label>
            <Input
              placeholder='Type'
              {...register('bio', { required: false })}
            />
          </div>

          <hr color='#0000000D' className='mb-[20px]'/>

          {/* Password Section */}
          <div>
            <Label className='text-[15px] text-[#CCCCCC] mb-3 block'>PASSWORD</Label>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                  PASSWORD <span className='text-[14px] text-[#4D4D4D]'>*</span>
                </Label>
                <Input
                  type='password'
                  placeholder='Type'
                  {...register('password', { 
                    required: 'Password is required', 
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    onBlur: () => {
                      trigger('password');
                      trigger('repeatPassword');
                    }
                  })}
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message?.toString()}
                  </p>
                )}
              </div>
              <div>
                <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                  REPEAT PASSWORD <span className='text-[14px] text-[#4D4D4D]'>*</span>
                </Label>
                <Input
                  type='password'
                  placeholder='Type'
                  {...register('repeatPassword', {
                    required: true,
                    validate: value => value === watch('password') || 'Passwords do not match',
                    onBlur: () => {
                      trigger('repeatPassword');
                      trigger('password');
                    }
                  })}
                />
                {errors.repeatPassword && (
                  <p className='text-red-500 text-sm'>
                    {errors.repeatPassword.message?.toString() || 'Required'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr color='#0000000D' className='mb-[20px]'/>

          {/* Moderation */}
          <div>
            <Label className='text-[15px] text-[#CCCCCC] mb-3 block'>
              MODERATION
            </Label>
            <div>
              <Label className='text-[14px] text-[#4D4D4D] mb-1 block'>
                MODERATION NOTES
              </Label>
              <Textarea
                placeholder='Type'
                {...register('moderation_notes', { required: false })}
                className='min-h-[36px]'
              />
            </div>
          </div>

          <hr color='#0000000D' className='mb-[20px]'/>

          {/* Welcome Email */}
          <div>
            <Label className='text-[14px] text-[#808080] mb-3 block'>
              WELCOME EMAIL
            </Label>
            <Controller
              control={control}
              name='sendWelcomeEmail'
              render={({ field }) => (
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 rounded-xl transition-colors cursor-pointer
                    ${field.value ? 'bg-[#4D4D4D]' : 'bg-[#E0E0E0]'}
                  `}
                  onClick={() => field.onChange(!field.value)}
                >
                  {field.value ? (
                    <svg width="16" height="16" viewBox="0 0 28 28" className="mr-[5px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="14" cy="14" r="14" fill="white"/>
                      <path d="M9 14.5L12.5 18L19 11" stroke="#4D4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span className="w-[16px] h-[16px] mr-[5px] inline-block" />
                  )}
                  <span className={`text-[15px] font-medium ${field.value ? 'text-white' : 'text-[#4D4D4D]'}`}>
                    Send welcome email
                  </span>
                </button>
              )}
            />
          </div>

          <hr color='#0000000D' className='mb-[20px]'/>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-[30px]'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => {
                reset();
                clearErrors();
                createUserMutation.reset();
                setAvatarFile(null);
                setAvatarUrl('');
                onOpenChange(false);
              }}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              className='flex-1 cursor-pointer' 
              type='submit'
              disabled={createUserMutation.isPending || isUploading}
            >
              {createUserMutation.isPending || isUploading ? (
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
                  {isUploading ? 'Uploading avatar...' : 'Creating user...'}
                </div>
              ) : (
                'Create user'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
