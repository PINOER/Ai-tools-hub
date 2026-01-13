import { PromptsProvider, usePrompts } from '@/contexts/PromptsContext';
import { PromptsTabsSection } from '@/components/prompts/PromptsTabsSection';
import { PromptCategoriesTab } from '@/components/prompts/PromptCategoriesTab';
import { PromptsDialogs } from '@/components/prompts/PromptsDialogs';
import { PromptsTab } from '@/components/prompts/PromptsTab';

function PromptsContent() {
  const { selectedTab } = usePrompts();

  return (
    <div className="font-inter px-10 pt-12 mt-10">
      <PromptsTabsSection />

      {selectedTab === 'prompts' && <PromptsTab />}
      {selectedTab === 'prompt_categories' && <PromptCategoriesTab />}

      <PromptsDialogs />
    </div>
  );
}

export default function Prompts() {
  return (
    <PromptsProvider>
      <PromptsContent />
    </PromptsProvider>
  );
}
