import { LearningProvider, useLearning } from '@/contexts/LearningContext';
import { LearningTabsSection } from '@/components/learning/LearningTabsSection';
import { LearningCategoriesTab } from '@/components/learning/LearningCategoriesTab';
import { LearningDialogs } from '@/components/learning/LearningDialogs';
import { LearningTab } from '@/components/learning/LearningTab';

function LearningContent() {
  const { selectedTab } = useLearning();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <LearningTabsSection />

      {selectedTab === 'learning' && <LearningTab />}
      {selectedTab === 'categories' && <LearningCategoriesTab />}

      <LearningDialogs />
    </div>
  );
}

export default function Learning() {
  return (
    <LearningProvider>
      <LearningContent />
    </LearningProvider>
  );
}
