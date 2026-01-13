import Image from "next/image";
import ToolsData from './ToolsData';
import { ToolSubmissions } from "@/types/components";

interface ToolsProps {
  tools: ToolSubmissions[];
  loading: boolean;
  isError: boolean;
}

export default function Tools({ tools, loading, isError }: ToolsProps) {

  if (loading) {
    return <div className="mt-[40px] ml-1">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-[40px] ml-1 text-red-500">Failed to load tools.</div>;
  }

  if (!tools || !tools.length) {
    return (
      <div className="flex flex-col justify-center items-center border border-dashed border-[#F2F2F2] h-[127px] rounded-[10px] mt-[40px] ml-1">
        <div className="flex gap-3">
          <Image src="/Group.svg" alt="group" width={24} height={27} />
          <p className="font-medium text-[20px] text-[#808080]">No tools submitted</p>
        </div>
        <button className="w-[122px] h-[40px] bg-[#000000] text-white font-[Nunito] font-semibold mt-[20px] rounded-[10px]">Submit tool</button>
      </div>
    );
  }

  return (
    <div className="mt-[40px] ml-1">
      <p className="font-medium text-[15px] text-[#CCCCCC] ">Submitted Tools {tools.length}</p>
      <ToolsData tools={tools} />
    </div>
  );
}