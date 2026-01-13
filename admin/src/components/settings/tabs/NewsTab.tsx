import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsfeedSettingsTab } from '@/components/settings/tabs/news/NewsfeedSettingsTab';
import { FetchingTab } from '@/components/settings/tabs/news/FetchingTab';
import { AIGenerationTab } from '@/components/settings/tabs/news/AIGenerationTab';
import { HistoryTab } from '@/components/settings/tabs/news/HistoryTab';

export const NewsTab = () => {
  const [activeSubTab, setActiveSubTab] = useState('newsfeed-settings');

  const handleSave = () => {
    console.log('Saving news data');
  };

  const subTabs = [
    { id: 'newsfeed-settings', label: 'Newsfeed settings' },
    { id: 'fetching', label: 'Fetching' },
    { id: 'ai-generation', label: 'AI generation' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-4 gap-1 h-auto bg-transparent p-0 mb-6">
          {subTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className='border-1 bg-white border-gray-200 data-[state=active]:bg-[#4D4D4D] data-[state=active]:text-white hover:cursor-pointer'
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="newsfeed-settings">
          <NewsfeedSettingsTab />
        </TabsContent>
        <TabsContent value="fetching">
          <FetchingTab />
        </TabsContent>
        <TabsContent value="ai-generation">
          <AIGenerationTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" className='flex-1 hover:cursor-pointer'>Back</Button>
        <Button onClick={handleSave} className="flex-1 bg-black text-white hover:bg-gray-800 hover:cursor-pointer">
          Save
        </Button>
      </div>
    </div>
  );
};