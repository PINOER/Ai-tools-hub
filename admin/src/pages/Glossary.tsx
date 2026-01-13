import { GlossaryProvider, useGlossary } from '@/contexts/GlossaryContext';
import { GlossaryTabsSection } from '@/components/glossary/GlossaryTabsSection';
import { GlossaryCategoriesTab } from '@/components/glossary/GlossaryCategoriesTab';
import { GlossaryDialogs } from '@/components/glossary/GlossaryDialogs';
import { GlossaryTab } from '@/components/glossary/GlossaryTab';

function GlossaryContent() {
  const { selectedTab } = useGlossary();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <GlossaryTabsSection />

      {selectedTab === 'glossary' && <GlossaryTab />}
      {selectedTab === 'categories' && <GlossaryCategoriesTab />}

      <GlossaryDialogs />
    </div>
  );
}

export default function Glossary() {
  return (
    <GlossaryProvider>
      <GlossaryContent />
    </GlossaryProvider>
  );
}
