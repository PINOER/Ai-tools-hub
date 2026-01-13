"use client";

import React from "react";
import ToolCard from "./cards/ToolCard";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { HomeTool } from "@/types/components";
import { ToolCardSkeleton } from "./skeletonCards/ToolCardSkeleton";

interface AiToolsSectionProps {
  tools: HomeTool[];
  isLoading: boolean;
}

export default function AiToolsSection({
  tools,
  isLoading,
}: AiToolsSectionProps) {
  return (
    <section className="py-6">
      <SectionHeader
        title="AI tools"
        color="#007AFF"
        icon={
          <Image
            src="/magic-icon.svg"
            alt="AI Tools"
            width={32}
            height={32}
            className="inline-block"
          />
        }
        viewAllHref={"/ai-tools"}
      />
      {tools.length === 0 && (
        <div className="flex justify-center items-center ">
          <p className="text-gray-500">No tools found</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [1, 2, 3, 4, 5, 6].map((tool) => <ToolCardSkeleton key={tool} />)
          : tools.map((tool) => (
              <ToolCard
                key={tool.id}
                logo={tool.avatar || "/pngImages/dummy-img.png"}
                name={tool.name}
                description={tool.short_description}
                tags={tool.tool_tags?.map((tag) => tag.tag.name) || []}
                stars={tool?.rating || 0} // or use a real value if available
                websiteUrl={tool.website_url}
                toolId={tool.id}
              />
            ))}
      </div>
    </section>
  );
}
