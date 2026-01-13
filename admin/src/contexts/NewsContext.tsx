import { createContext, useContext, useState, type ReactNode } from 'react';
import type { News } from '@/types/news';

interface ModalState {
  newsDetails: boolean;
  createNews: boolean;
  editNews: boolean;
  deleteNews: boolean;
  importNews: boolean;
  exportNews: boolean;
  filterModal: boolean;
  publishConfirmation: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface NewsContextType {
  // Data
  news: News[];
  setNews: (news: News[] | ((prev: News[]) => News[])) => void;
  categories: any[];
  setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
  tags: any[];
  setTags: (tags: any[] | ((prev: any[]) => any[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  newsToView: News | null;
  setNewsToView: (news: News | null) => void;
  createdNews: News | undefined;
  setCreatedNews: (news: News | undefined) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNewsState] = useState<News[]>([]);
  const [categories, setCategoriesState] = useState<any[]>([]);
  const [tags, setTagsState] = useState<any[]>([]);
  
  const setNews = (value: News[] | ((prev: News[]) => News[])) => {
    if (typeof value === 'function') {
      setNewsState(value);
    } else {
      setNewsState(value);
    }
  };
  
  const setCategories = (value: any[] | ((prev: any[]) => any[])) => {
    if (typeof value === 'function') {
      setCategoriesState(value);
    } else {
      setCategoriesState(value);
    }
  };

  const setTags = (value: any[] | ((prev: any[]) => any[])) => {
    if (typeof value === 'function') {
      setTagsState(value);
    } else {
      setTagsState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('news');
  const [newsToView, setNewsToView] = useState<News | null>(null);
  const [createdNews, setCreatedNews] = useState<News | undefined>(undefined);
  
  const [modals, setModals] = useState<ModalState>({
    newsDetails: false,
    createNews: false,
    editNews: false,
    deleteNews: false,
    importNews: false,
    exportNews: false,
    filterModal: false,
    publishConfirmation: false,
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
      newsDetails: false,
      createNews: false,
      editNews: false,
      deleteNews: false,
      importNews: false,
      exportNews: false,
      filterModal: false,
      publishConfirmation: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: NewsContextType = {
    news,
    setNews,
    categories,
    setCategories,
    tags,
    setTags,
    selectedTab,
    setSelectedTab,
    newsToView,
    setNewsToView,
    createdNews,
    setCreatedNews,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
} 