import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Role {
  id: number;
  role: 'User' | 'Moderator' | 'Contributor' | 'Admin';
}

interface useUserInterface {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  userId: number | null;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  role: Role | null;
  status: string | null;
  avatar: string | null;
  bio: string | null;
  toolsSubmitted: number | null;
  comments: number | null;
  moderation_notes: string | null;
  setIsLoggedIn: (logged: boolean) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUserId: (id: number) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setUserData: (userData: Partial<useUserInterface>) => void;
  logout: () => void;
}

export const useUser = create<useUserInterface>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      refreshToken: null,
      userId: null,
      name: null,
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      role: null,
      status: null,
      avatar: null,
      bio: null,
      toolsSubmitted: null,
      comments: null,
      moderation_notes: null,
      setIsLoggedIn: (logged: boolean) => set({ isLoggedIn: logged }),
      setToken: (token: string) => set({ token }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setUserId: (id: number) => set({ userId: id }),
      setName: (name: string) => set({ name }),
      setEmail: (email: string) => set({ email }),
      setUserData: (userData: Partial<useUserInterface>) => set(userData),
      logout: () => {
        localStorage.removeItem('useUser-storage');
        set({ 
          isLoggedIn: false, 
          token: null, 
          refreshToken: null, 
          userId: null, 
          name: null,
          first_name: null,
          last_name: null,
          username: null,
          email: null,
          role: null,
          status: null,
          avatar: null,
          bio: null,
          toolsSubmitted: null,
          comments: null,
          moderation_notes: null
        });
      }
    }),
    {
      name: 'useUser-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        token: state.token,
        refreshToken: state.refreshToken,
        userId: state.userId,
        name: state.name,
        first_name: state.first_name,
        last_name: state.last_name,
        username: state.username,
        email: state.email,
        role: state.role,
        status: state.status,
        avatar: state.avatar,
        bio: state.bio,
        toolsSubmitted: state.toolsSubmitted,
        comments: state.comments,
        moderation_notes: state.moderation_notes,
      }),
    }
  )
);
