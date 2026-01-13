import type { Learning } from '@/types/learning';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalState {
  learningDetails: boolean;
  createLearning: boolean;
  editLearning: boolean;
  deleteLearning: boolean;
  importLearning: boolean;
  exportLearning: boolean;
  filterModal: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface LearningContextType {
  // Data
  learnings: Learning[];
  setLearnings: (learnings: Learning[] | ((prev: Learning[]) => Learning[])) => void;
  categories: any[];
  setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  learningToView: Learning | null;
  setLearningToView: (Learning: Learning | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [learnings, setLearningsState] = useState<Learning[]>([]);
  const [categories, setCategoriesState] = useState<any[]>([]);
  
  const setLearnings = (value: Learning[] | ((prev: Learning[]) => Learning[])) => {
    if (typeof value === 'function') {
      setLearningsState(value);
    } else {
      setLearningsState(value);
    }
  };
  
  const setCategories = (value: any[] | ((prev: any[]) => any[])) => {
    if (typeof value === 'function') {
      setCategoriesState(value);
    } else {
      setCategoriesState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('learning');
  const [learningToView, setLearningToView] = useState<Learning | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    learningDetails: false,
    createLearning: false,
    editLearning: false,
    deleteLearning: false,
    importLearning: false,
    exportLearning: false,
    filterModal: false,
    createCategory: false,
    editCategory: false,
    deleteCategory: false,
    categoryDetails: false,
    importCategory: false,
    exportCategory: false,
  });

  const toggleModal = (modalName: keyof ModalState, value: boolean) => {
    setModals(prev => ({ ...prev, [modalName]: value }));
  };

  const openModal = (modalName: keyof ModalState) => {
    toggleModal(modalName, true);
  };

  const closeModal = (modalName: keyof ModalState) => {
    toggleModal(modalName, false);
  };

  const closeAllModals = () => {
    setModals({
      learningDetails: false,
      createLearning: false,
      editLearning: false,
      deleteLearning: false,
      importLearning: false,
      exportLearning: false,
      filterModal: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: LearningContextType = {
    learnings,
    setLearnings,
    categories,
    setCategories,
    selectedTab,
    setSelectedTab,
    learningToView,
    setLearningToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
} 