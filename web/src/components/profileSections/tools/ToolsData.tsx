import React from 'react';
import Image from "next/image";
import type { ToolSubmissions } from '@/types/components';

interface ToolsDataProps {
  tools: ToolSubmissions[];
}

const ToolsData: React.FC<ToolsDataProps> = ({ tools }) => {
  if (!tools || !tools.length) {
    return <div className="text-gray-400">No tools found.</div>;
  }
  return (
    <div className="flex flex-col gap-6 mt-[20px]">
      {tools.map((tool) => (
        <div key={tool.id} className="flex flex-wrap items-start gap-4">
          <Image
            src={tool.avatar}
            alt={tool.name}
            width={80}
            height={80}
            className="w-[80px] h-[80px] border border-gray-200 rounded-[10px] object-cover bg-white"
          />
          <div className="flex flex-col">
            <p className="font-[inter] font-medium text-[15px] text-[#000000]">{tool.name}</p>
            <p className="font-[inter] font-medium text-[15px] text-[#808080] mb-[8px]">{tool.short_description}</p>
            <div className="flex flex-wrap items-center gap-2">
              {tool.tool_categories.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-[#FFFFFF] border border-gray-200 text-[#007AFF] font-[Nunito] font-bold text-[12px] px-2 py-0 rounded-[6px] mb-[4px]"
                >
                  {cat.name}
                </span>
              ))}
              {tool.tool_tags.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-[#FFFFFF] border border-gray-200 text-[#007AFF] font-[Nunito] font-bold text-[12px] px-2 py-0 rounded-[6px] mb-[4px]"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToolsData;