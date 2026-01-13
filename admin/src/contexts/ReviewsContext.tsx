import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Review } from '@/types/reviews';
import { REVIEWS_TABS } from '@/lib/contants';

interface ModalState {
  reviewDetails: boolean;
  createReview: boolean;
  editReview: boolean;
  deleteReview: boolean;
  importReview: boolean;
  filterModal: boolean;
}

interface ReviewsContextType {
  // Data
  reviews: Review[];
  setReviews: (reviews: Review[] | ((prev: Review[]) => Review[])) => void;
  
  // UI State
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  reviewToView: Review | null;
  setReviewToView: (review: Review | null) => void;
  
  // Modal Management
  modals: ModalState;
  toggleModal: (modalName: keyof ModalState, value: boolean) => void;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviewsState] = useState<Review[]>([]);
  
  const setReviews = (value: Review[] | ((prev: Review[]) => Review[])) => {
    if (typeof value === 'function') {
      setReviewsState(value);
    } else {
      setReviewsState(value);
    }
  };
  
  const [selectedTab, setSelectedTab] = useState(REVIEWS_TABS.review);
  const [reviewToView, setReviewToView] = useState<Review | null>(null);
  
  const [modals, setModals] = useState<ModalState>({
    reviewDetails: false,
    createReview: false,
    editReview: false,
    deleteReview: false,
    importReview: false,
    filterModal: false,
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
      reviewDetails: false,
      createReview: false,
      editReview: false,
      deleteReview: false,
      importReview: false,
      filterModal: false,
    });
  };

  const value: ReviewsContextType = {
    reviews,
    setReviews,
    selectedTab,
    setSelectedTab,
    reviewToView,
    setReviewToView,
    modals,
    toggleModal,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
} 