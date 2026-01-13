import React from 'react';
import { TOOL_TABS } from '@/lib/contants';

interface ToolsTabsSectionProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const ToolsTabsSection = React.memo<ToolsTabsSectionProps>(
  ({ selectedTab, setSelectedTab }) => (
    <div className='flex items-center justify-between w-full px-4 py-2'>
      <div className='flex items-center gap-4 text-sm'>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === TOOL_TABS.tools
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(TOOL_TABS.tools)}
        >
          Tools
        </p>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === TOOL_TABS.tool_submissions
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(TOOL_TABS.tool_submissions)}
        >
          Tool submissions
        </p>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === TOOL_TABS.tool_claims
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(TOOL_TABS.tool_claims)}
        >
          Tool claims
        </p>
        <p
          className={`rounded-md py-1 px-4 cursor-pointer ${
            selectedTab === TOOL_TABS.tool_categories
              ? 'bg-[#4D4D4D] text-white'
              : 'bg-white border-2 border-[#F2F2F2]'
          }`}
          onClick={() => setSelectedTab(TOOL_TABS.tool_categories)}
        >
          Tool categories
        </p>
      </div>
    </div>
  ),
  (prevProps, nextProps) => {
    // Only re-render if selectedTab changes
    return prevProps.selectedTab === nextProps.selectedTab;
  }
); 