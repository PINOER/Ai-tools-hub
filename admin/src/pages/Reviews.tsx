import { ReviewsProvider, useReviews } from '@/contexts/ReviewsContext';
import { REVIEWS_TABS } from '@/lib/contants';
import { ReviewsTabsSection } from '@/components/reviews/ReviewsTabsSection';
import { ReviewsTab } from '@/components/reviews/ReviewsTab';
import { ReviewsDialogs } from '@/components/reviews/ReviewsDialogs';

function ReviewsContent() {
  const { selectedTab, setSelectedTab } = useReviews();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <ReviewsTabsSection selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === REVIEWS_TABS.review && <ReviewsTab />}
      {selectedTab === REVIEWS_TABS.review_categories && <div>Review Categories (Coming Soon)</div>}

      <ReviewsDialogs />
    </div>
  );
}

export default function Reviews() {
  return (
    <ReviewsProvider>
      <ReviewsContent />
    </ReviewsProvider>
  );
}
