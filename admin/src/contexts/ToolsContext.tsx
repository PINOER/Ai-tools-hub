import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Tools, ToolSubmission, ToolClaim } from '@/types/tools';

interface ModalState {
  toolDetails: boolean;
  createTool: boolean;
  editTool: boolean;
  deleteTool: boolean;
  importTool: boolean;
  exportTool: boolean;
  toolClaimDetails: boolean;
  toolClaimApproved: boolean;
  filterModal: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface ToolsContextType {
  // Data
  tools: Tools[];
  setTools: (tools: Tools[] | ((prev: Tools[]) => Tools[])) => void;
  submissions: ToolSubmission[];
  setSubmissions: (submissions: ToolSubmission[] | ((prev: ToolSubmission[]) => ToolSubmission[])) => void;
  claims: ToolClaim[];
  setClaims: (claims: ToolClaim[] | ((prev: ToolClaim[]) => ToolClaim[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  toolToView: Tools | null;
  setToolToView: (tool: Tools | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setToolsState] = useState<Tools[]>([]);
  const [submissions, setSubmissionsState] = useState<ToolSubmission[]>([]);
  const [claims, setClaimsState] = useState<ToolClaim[]>([]);
  
  const setTools = (value: Tools[] | ((prev: Tools[]) => Tools[])) => {
    if (typeof value === 'function') {
      setToolsState(value);
    } else {
      setToolsState(value);
    }
  };
  
  const setSubmissions = (value: ToolSubmission[] | ((prev: ToolSubmission[]) => ToolSubmission[])) => {
    if (typeof value === 'function') {
      setSubmissionsState(value);
    } else {
      setSubmissionsState(value);
    }
  };
  
  const setClaims = (value: ToolClaim[] | ((prev: ToolClaim[]) => ToolClaim[])) => {
    if (typeof value === 'function') {
      setClaimsState(value);
    } else {
      setClaimsState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('tools');
  const [toolToView, setToolToView] = useState<Tools | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    toolDetails: false,
    createTool: false,
    editTool: false,
    deleteTool: false,
    importTool: false,
    exportTool: false,
    toolClaimDetails: false,
    toolClaimApproved: false,
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
      toolDetails: false,
      createTool: false,
      editTool: false,
      deleteTool: false,
      importTool: false,
      exportTool: false,
      toolClaimDetails: false,
      toolClaimApproved: false,
      filterModal: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: ToolsContextType = {
    tools,
    setTools,
    submissions,
    setSubmissions,
    claims,
    setClaims,
    selectedTab,
    setSelectedTab,
    toolToView,
    setToolToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider');
  }
  return context;
} 