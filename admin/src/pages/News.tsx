import { NewsProvider, useNews } from '@/contexts/NewsContext';
import { NewsTabsSection } from '@/components/news/NewsTabsSection';
import { NewsCategoriesTab } from '@/components/news/NewsCategoriesTab';
import { NewsDialogs } from '@/components/news/NewsDialogs';
import { NewsTab } from '@/components/news/NewsTab';

function NewsContent() {
  const { selectedTab } = useNews();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <NewsTabsSection />

      {selectedTab === 'news' && <NewsTab />}
      {selectedTab === 'news_categories' && <NewsCategoriesTab />}

      <NewsDialogs />
    </div>
  );
}

export default function News() {
  return (
    <NewsProvider>
      <NewsContent />
    </NewsProvider>
  );
}
