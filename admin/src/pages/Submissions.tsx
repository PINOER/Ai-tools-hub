import { ToolsProvider } from "@/contexts/ToolsContext";
import { SubmissionsTab } from "@/components/tools/SubmissionsTab";
import { ToolsDialogs } from "@/components/tools/ToolsDialogs";

export default function Submissions() {
  return (
    <ToolsProvider>
      <div className="font-[inter] px-10 pt-10 ">
        <SubmissionsTab />
        <ToolsDialogs />
      </div>
    </ToolsProvider>
  );
}
