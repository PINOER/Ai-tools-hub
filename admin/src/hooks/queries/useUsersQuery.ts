import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getUsersApi, 
  getUserByIdApi,
  checkUsernameApi,
  deleteUserApi, 
  createUserApi, 
  updateUserApi,
  updateProfileApi,
  activateUserApi,
  banUserApi,
  suspendUserApi,
  activateMultipleUsersApi,
  banMultipleUsersApi,
  suspendMultipleUsersApi,
  deleteMultipleUsersApi
} from '@/api/users';
import { queryClient } from '@/lib/queryClient';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import type { User } from '@/types/user';
import { UserStatus } from '@/types/user';

interface UsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  role?: string;
  is_active?: boolean;
  created_at?: string;
}

// Query Keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UsersFilters) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
  current: () => [...usersKeys.all, 'current'] as const,
};

// Fetch users with filters
export function useUsersQuery(filters: UsersFilters = {}) {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: async () => {
      const result = await getUsersApi(filters);
      return result;
    },
    staleTime: 100, // 5 minutes
  });
}

// Get user by ID
export function useGetUserByIdQuery(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: async () => {
      const result = await getUserByIdApi(id);
      return result;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}


// Check username availability
export function useCheckUsernameQuery(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['users', 'check-username', username],
    queryFn: async () => {
      const result = await checkUsernameApi(username);
      return result;
    },
    enabled: enabled && username.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create user mutation
export function useCreateUserMutation() {
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id'>) => {
      const result = await createUserApi(userData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User created successfully!');
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      showErrorToast('Failed to create user');
    },
  });
}

// Update user mutation
export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: number; 
      data: {
        username?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        password?: string;
        role?: 'User' | 'Moderator' | 'Contributor' | 'Admin';
        status?: 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive';
        avatar?: string;
        provider?: string;
        provider_id?: string;
        access_token?: string;
        bio?: string;
        moderation_notes?: string;
      }
    }) => {
      console.log('useUpdateUserMutation called with:', { id, data });
      await updateUserApi(id, data);
      console.log('updateUserApi completed');
      return { id, data };
    },
    onSuccess: (_, { id }) => {
      console.log('useUpdateUserMutation onSuccess called for id:', id);
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      showErrorToast('Failed to update user');
    },
  });
}

// Delete user mutation
export function useDeleteUserMutation() {
  return useMutation({
    mutationFn: async (id: number) => {
      await deleteUserApi(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: usersKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      showErrorToast('Failed to delete user');
    },
  });
}

// Activate user mutation
export function useActivateUserMutation() {
  return useMutation({
    mutationFn: async (user: User) => {
      await activateUserApi(user);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User activated successfully!');
    },
    onError: (error) => {
      console.error('Error activating user:', error);
      showErrorToast('Failed to activate user');
    },
  });
}

// Ban user mutation
export function useBanUserMutation() {
  return useMutation({
    mutationFn: async (user: User) => {
      await banUserApi(user);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User banned successfully!');
    },
    onError: (error) => {
      console.error('Error banning user:', error);
      showErrorToast('Failed to ban user');
    },
  });
}

// Suspend user mutation
export function useSuspendUserMutation() {
  return useMutation({
    mutationFn: async (user: User) => {
      await suspendUserApi(user);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast('User suspended successfully!');
    },
    onError: (error) => {
      console.error('Error suspending user:', error);
      showErrorToast('Failed to suspend user');
    },
  });
}

// Update profile mutation
export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: async ({ userId, data }: {
      userId: number;
      data: {
        username?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        password?: string;
        role?: 'User' | 'Moderator' | 'Contributor' | 'Admin';
        status?: 'Active' | 'Pending' | 'Banned' | 'Suspended' | 'Inactive';
        avatar?: string;
        bio?: string;
        moderation_notes?: string;
      }
    }) => {
      const result = await updateProfileApi(userId, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.current() });
      showSuccessToast('Profile updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      showErrorToast('Failed to update profile');
    },
  });
}

// Bulk operations mutations
export function useBulkUsersMutation() {
  return useMutation({
    mutationFn: async ({ 
      action, 
      userIds 
    }: { 
      action: 'activate' | 'ban' | 'suspend' | 'delete'; 
      userIds: number[] 
    }) => {
      switch (action) {
        case 'activate':
          await activateMultipleUsersApi(userIds);
          break;
        case 'ban':
          await banMultipleUsersApi(userIds);
          break;
        case 'suspend':
          await suspendMultipleUsersApi(userIds);
          break;
        case 'delete':
          await deleteMultipleUsersApi(userIds);
          break;
      }
      return { action, userIds };
    },
    onSuccess: ({ action, userIds }) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      showSuccessToast(`${userIds.length} users ${action}d successfully!`);
    },
    onError: (error) => {
      console.error('Error performing bulk user operation:', error);
      showErrorToast('Failed to perform bulk operation');
    },
  });
} 