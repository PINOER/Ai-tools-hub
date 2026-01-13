import { ToolsProvider, useTools } from '@/contexts/ToolsContext';
import { TOOL_TABS } from '@/lib/contants';
import { ToolsTabsSection } from '@/components/tools/ToolsTabsSection';
import { SubmissionsTab } from '@/components/tools/SubmissionsTab';
import { ClaimsTab } from '@/components/tools/ClaimsTab';
import { CategoriesTab } from '@/components/tools/CategoriesTab';
import { ToolsDialogs } from '@/components/tools/ToolsDialogs';
import { ToolsTab } from '@/components/tools/ToolsTab';

function AIToolsContent() {
  const { selectedTab, setSelectedTab } = useTools();

  return (
    <div className="font-[inter] px-10 pt-12 mt-10">
      <ToolsTabsSection selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {selectedTab === TOOL_TABS.tool_categories && <CategoriesTab />}

      {selectedTab === TOOL_TABS.tools && <ToolsTab />}
      {selectedTab === TOOL_TABS.tool_submissions && <SubmissionsTab />}
      {selectedTab === TOOL_TABS.tool_claims && <ClaimsTab />}

      <ToolsDialogs />
    </div>
  );
}

export default function AITools() {
  return (
    <ToolsProvider>
      <AIToolsContent />
    </ToolsProvider>
  );
}
