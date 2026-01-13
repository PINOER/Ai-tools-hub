import { useNews } from '@/contexts/NewsContext';

export const NewsTabsSection = () => {
  const { selectedTab, setSelectedTab } = useNews();

  const tabs = [
    { id: 'news', label: 'News' },
    { id: 'news_categories', label: 'News Categories' },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${
            selectedTab === tab.id 
              ? 'bg-[#4D4D4D] text-white' 
              : 'border-2 border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
          }`}
          onClick={() => setSelectedTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}; 