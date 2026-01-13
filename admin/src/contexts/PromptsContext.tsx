import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Prompt, PromptSubmission } from '@/types/prompt';

interface ModalState {
  promptDetails: boolean;
  createPrompt: boolean;
  editPrompt: boolean;
  deletePrompt: boolean;
  importPrompt: boolean;
  exportPrompt: boolean;
  filterModal: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface PromptsContextType {
  // Data
  prompts: Prompt[];
  setPrompts: (prompts: Prompt[] | ((prev: Prompt[]) => Prompt[])) => void;
  submissions: PromptSubmission[];
  setSubmissions: (submissions: PromptSubmission[] | ((prev: PromptSubmission[]) => PromptSubmission[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  promptToView: Prompt | null;
  setPromptToView: (prompt: Prompt | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const PromptsContext = createContext<PromptsContextType | undefined>(undefined);

export function PromptsProvider({ children }: { children: ReactNode }) {
  const [prompts, setPromptsState] = useState<Prompt[]>([]);
  const [submissions, setSubmissionsState] = useState<PromptSubmission[]>([]);
  
  const setPrompts = (value: Prompt[] | ((prev: Prompt[]) => Prompt[])) => {
    if (typeof value === 'function') {
      setPromptsState(value);
    } else {
      setPromptsState(value);
    }
  };
  
  const setSubmissions = (value: PromptSubmission[] | ((prev: PromptSubmission[]) => PromptSubmission[])) => {
    if (typeof value === 'function') {
      setSubmissionsState(value);
    } else {
      setSubmissionsState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('prompts');
  const [promptToView, setPromptToView] = useState<Prompt | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    promptDetails: false,
    createPrompt: false,
    editPrompt: false,
    deletePrompt: false,
    importPrompt: false,
    exportPrompt: false,
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
      promptDetails: false,
      createPrompt: false,
      editPrompt: false,
      deletePrompt: false,
      importPrompt: false,
      exportPrompt: false,
      filterModal: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: PromptsContextType = {
    prompts,
    setPrompts,
    submissions,
    setSubmissions,
    selectedTab,
    setSelectedTab,
    promptToView,
    setPromptToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <PromptsContext.Provider value={value}>
      {children}
    </PromptsContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptsContext);
  if (context === undefined) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return context;
} 