import React from "react";
import { FaStar } from "react-icons/fa";
import { HiArrowUp } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { ToolCardProps } from "@/types/components";

export default function ToolCard({
  logo,
  name,
  description,
  tags,
  stars,
  websiteUrl,
  toolId,
}: ToolCardProps) {
  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // ✅ Prevent Link navigation
    if (websiteUrl) {
      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Link href={`/ai-tools/${toolId}`} className="block h-full">
      <div className="flex gap-4 p-2 transition-all bg-white rounded-xl hover:bg-gray-50 cursor-pointer h-full">
        {/* ✅ Responsive logo container */}
        <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={logo}
            alt={name}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 60px, 80px"
          />
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-[15px] font-semibold text-black">{name}</h3>
            <p className="text-[14px] text-gray-600 mt-1 line-clamp-2 font-medium">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[12px] text-[#007AFF] font-semibold rounded-md border border-[#F2F2F2] py-[2px] px-[6px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-[#808080]">
            <span className="flex items-center gap-1 text-[12px] font-semibold rounded-md border border-[#F2F2F2] py-[2px] px-[6px]">
              <FaStar className="w-3 h-3 text-[#808080]" />
              {stars}
            </span>
            {websiteUrl && (
              <button
                onClick={handleArrowClick}
                className="text-[12px] flex items-center justify-center text-[#808080] font-semibold rounded-md border border-[#F2F2F2] p-[4px] hover:bg-gray-100 transition-colors"
                title={`Visit ${name} website`}
              >
                <HiArrowUp className="w-4 h-4 text-[#808080] rotate-45 font-bold" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
