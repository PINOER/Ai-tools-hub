import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { loginUserApi } from '@/api/auth';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { showSuccessToast } from '@/lib/toast';

const Login = () => {
  const navigate = useNavigate();
  const userHook = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (formData: any) => {
    try {
      const response = await loginUserApi(formData);
      
      // Store all user data in the hook
      userHook.setUserData({
        isLoggedIn: true,
        token: response.accessToken || '',
        refreshToken: response.refreshToken || '',
        userId: response.id,
        name: response.name || '',
        first_name: response.first_name || '',
        last_name: response.last_name || '',
        username: response.username || '',
        email: response.email || '',
        role: response.role || null,
        status: response.status || '',
        avatar: response.avatar || '',
        bio: response.bio || '',
        toolsSubmitted: response.toolsSubmitted || 0,
        comments: Array.isArray(response.comments) ? response.comments.length : response.comments || 0,
        moderation_notes: response.moderation_notes || '',
      });
      
      console.log('User logged in:', response.id);
      showSuccessToast('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='h-[80vh] w-full flex items-center justify-center'>
      <form
        className='flex flex-col gap-5 justify-center'
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className='flex flex-col gap-1'>
          <p>EMAIL *</p>
          <Input
            placeholder='Type'
            {...register('email', {
              required: true,
            })}
          />
          {errors.email && (
            <p className='text-red-500 text-sm'>Email is Required</p>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <p>PASSWORD *</p>
          <Input
            placeholder='Type'
            {...register('password', {
              required: true,
            })}
            type='password'
          />
          {errors.password && (
            <p className='text-red-500 text-sm'>Password is Required</p>
          )}
        </div>
        <Button type='submit'>Login</Button>
      </form>
    </div>
  );
};

export default Login;
