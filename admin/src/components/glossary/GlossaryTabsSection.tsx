import { useGlossary } from '@/contexts/GlossaryContext';

export const GlossaryTabsSection = () => {
  const { selectedTab, setSelectedTab } = useGlossary();

  const tabs = [
    { id: 'glossary', label: 'Glossary' },
    { id: 'categories', label: 'Categories' },
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