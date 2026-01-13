import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Glossary } from '@/types/glossary';

interface ModalState {
  glossaryDetails: boolean;
  createGlossary: boolean;
  editGlossary: boolean;
  deleteGlossary: boolean;
  importGlossary: boolean;
  exportGlossary: boolean;
  filterModal: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface GlossaryContextType {
  // Data
  glossaries: Glossary[];
  setGlossaries: (glossaries: Glossary[] | ((prev: Glossary[]) => Glossary[])) => void;
  categories: any[];
  setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  glossaryToView: Glossary | null;
  setGlossaryToView: (glossary: Glossary | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const GlossaryContext = createContext<GlossaryContextType | undefined>(undefined);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [glossaries, setGlossariesState] = useState<Glossary[]>([]);
  const [categories, setCategoriesState] = useState<any[]>([]);
  
  const setGlossaries = (value: Glossary[] | ((prev: Glossary[]) => Glossary[])) => {
    if (typeof value === 'function') {
      setGlossariesState(value);
    } else {
      setGlossariesState(value);
    }
  };
  
  const setCategories = (value: any[] | ((prev: any[]) => any[])) => {
    if (typeof value === 'function') {
      setCategoriesState(value);
    } else {
      setCategoriesState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('glossary');
  const [glossaryToView, setGlossaryToView] = useState<Glossary | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    glossaryDetails: false,
    createGlossary: false,
    editGlossary: false,
    deleteGlossary: false,
    importGlossary: false,
    exportGlossary: false,
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
      glossaryDetails: false,
      createGlossary: false,
      editGlossary: false,
      deleteGlossary: false,
      importGlossary: false,
      exportGlossary: false,
      filterModal: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: GlossaryContextType = {
    glossaries,
    setGlossaries,
    categories,
    setCategories,
    selectedTab,
    setSelectedTab,
    glossaryToView,
    setGlossaryToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const context = useContext(GlossaryContext);
  if (context === undefined) {
    throw new Error('useGlossary must be used within a GlossaryProvider');
  }
  return context;
} 