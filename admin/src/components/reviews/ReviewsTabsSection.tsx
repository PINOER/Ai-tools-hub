import React from 'react';
import { REVIEWS_TABS } from '@/lib/contants';

interface ReviewsTabsSectionProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const ReviewsTabsSection = React.memo<ReviewsTabsSectionProps>(
  ({ selectedTab, setSelectedTab }) => (
    <div className='flex items-center justify-between w-full px-4 py-2'>
      <div className='flex items-center gap-4 text-sm'>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === REVIEWS_TABS.review
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(REVIEWS_TABS.review)}
        >
          {REVIEWS_TABS.review}
        </p>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === REVIEWS_TABS.review_categories
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(REVIEWS_TABS.review_categories)}
        >
          {REVIEWS_TABS.review_categories}
        </p>
      </div>
    </div>
  ),
  (prevProps, nextProps) => {
    return prevProps.selectedTab === nextProps.selectedTab;
  }
); 