"use client";

import React, { createContext, useContext } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { AuthContextType } from '@/types';
import { useQueryClient } from '@tanstack/react-query';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerkAuth();
  const queryClient = useQueryClient();


  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = async() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    await signOut()
    queryClient.invalidateQueries({ queryKey: ['tools'] });
  };

  const value = {
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}