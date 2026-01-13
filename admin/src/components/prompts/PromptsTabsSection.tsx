import { usePrompts } from '@/contexts/PromptsContext';

export const PromptsTabsSection = () => {
  const { selectedTab, setSelectedTab } = usePrompts();

  const tabs = [
    { id: 'prompts', label: 'Prompts' },
    { id: 'prompt_categories', label: 'Categories' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${
            selectedTab === tab.id 
              ? 'bg-[#4D4D4D] text-white' 
              : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
          }`}
          onClick={() => setSelectedTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}; 