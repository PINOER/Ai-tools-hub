import { ArticleDialogs } from '@/components/articles/ArticleDialogs';
import { ArticleCategoriesTab } from '@/components/articles/ArticlesCategoriesTab';
import { ArticleTabsSection } from '@/components/articles/ArticlesTabSection';
import { ArticleTab } from '@/components/articles/ArticleTab';
import { ArticleProvider, useArticle } from '@/contexts/ArticleContext';

function ArticleContent() {
  const { selectedTab } = useArticle();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <ArticleTabsSection />

      {selectedTab === 'article' && <ArticleTab />}
      {selectedTab === 'categories' && <ArticleCategoriesTab />}

      <ArticleDialogs />
    </div>
  );
}

export default function Article() {
  return (
    <ArticleProvider>
      <ArticleContent />
    </ArticleProvider>
  );
}
