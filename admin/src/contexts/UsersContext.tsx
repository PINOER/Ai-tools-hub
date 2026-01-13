import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '@/types/user';

interface UsersContextType {
  // Tab management
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  
  // Modal states
  modals: {
    createUser: boolean;
    editUser: boolean;
    userDetails: boolean;
    deleteUser: boolean;
    importUser: boolean;
    suspendUser: boolean;
    banUser: boolean;
    activateUser: boolean;
  };
  
  // Data states
  userToView: User | null;
  
  // Actions
  openModal: (modal: keyof UsersContextType['modals']) => void;
  closeModal: (modal: keyof UsersContextType['modals']) => void;
  setUserToView: (user: User | null) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTab, setSelectedTab] = useState('users');
  
  const [modals, setModals] = useState({
    createUser: false,
    editUser: false,
    userDetails: false,
    deleteUser: false,
    importUser: false,
    suspendUser: false,
    banUser: false,
    activateUser: false,
  });

  const [userToView, setUserToView] = useState<User | null>(null);

  const openModal = useCallback((modal: keyof UsersContextType['modals']) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: keyof UsersContextType['modals']) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  }, []);

  const value: UsersContextType = {
    selectedTab,
    setSelectedTab,
    modals,
    userToView,
    openModal,
    closeModal,
    setUserToView,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}; 