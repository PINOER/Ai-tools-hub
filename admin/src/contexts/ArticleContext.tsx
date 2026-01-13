import type { Article } from '@/types/article';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ModalState {
  articleDetails: boolean;
  createArticle: boolean;
  editArticle: boolean;
  deleteArticle: boolean;
  importArticle: boolean;
  exportArticle: boolean;
  filterModal: boolean;
  // Category modals
  createCategory: boolean;
  editCategory: boolean;
  deleteCategory: boolean;
  categoryDetails: boolean;
  importCategory: boolean;
  exportCategory: boolean;
}

interface ArticleContextType {
  // Data
  articles: Article[];
  setArticles: (articles: Article[] | ((prev: Article[]) => Article[])) => void;
  categories: any[];
  setCategories: (categories: any[] | ((prev: any[]) => any[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  articleToView: Article | null;
  setArticleToView: (article: Article | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [articles, setArticlesState] = useState<Article[]>([]);
  const [categories, setCategoriesState] = useState<any[]>([]);
  
  const setArticles = (value: Article[] | ((prev: Article[]) => Article[])) => {
    if (typeof value === 'function') {
      setArticlesState(value);
    } else {
      setArticlesState(value);
    }
  };
  
  const setCategories = (value: any[] | ((prev: any[]) => any[])) => {
    if (typeof value === 'function') {
      setCategoriesState(value);
    } else {
      setCategoriesState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState('article');
  const [articleToView, setArticleToView] = useState<Article | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    articleDetails: false,
    createArticle: false,
    editArticle: false,
    deleteArticle: false,
    importArticle: false,
    exportArticle: false,
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
      articleDetails: false,
      createArticle: false,
      editArticle: false,
      deleteArticle: false,
      importArticle: false,
      exportArticle: false,
      filterModal: false,
      createCategory: false,
      editCategory: false,
      deleteCategory: false,
      categoryDetails: false,
      importCategory: false,
      exportCategory: false,
    });
  };

  const value: ArticleContextType = {
    articles,
    setArticles,
    categories,
    setCategories,
    selectedTab,
    setSelectedTab,
    articleToView,
    setArticleToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticle() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticle must be used within a ArticleProvider');
  }
  return context;
} 