import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { MdIosShare } from "react-icons/md";
import { usePromptByIdQuery } from "@/hooks/queries/usePromptQuery";

interface PromptModalProps {
  onClose: () => void;
  promptId?: number;
}

export default function PromptModal({ onClose, promptId }: PromptModalProps) {
  const { data: prompt, isLoading, error } = usePromptByIdQuery(promptId!);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-2 mx-auto"></div>
              <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Error Loading Prompt</h2>
            <p className="text-gray-600 mb-4">
              Failed to load prompt details. Please try again.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 cursor-pointer bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Parse tags from string to array
  // const tags = prompt.data.tags ? prompt.data.tags.split(',').map(tag => tag.trim()) : [];

  // Get category name
  const categoryName = prompt.data.promptCategories?.[0]?.category?.name || "";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative w-full h-[90vh] max-w-4xl bg-white rounded-2xl shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className="px-8 pt-6 pb-0">
            <div className="flex flex-col justify-center flex-1 ml-2 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-full"
                  style={{
                    height: "1px",
                    background: `linear-gradient(to right, #34B1C8, #FFFFFF00, transparent)`,
                    transform: "scaleY(0.9)",
                    transformOrigin: "top", // Ensure scaling happens from the top
                  }}
                />
              ))}
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <FiX size={20} />
            </button>

            <div className="pt-18">
              {/* Title */}
              <h1 className="font-[inter] font-medium text-[25px] text-[#000000] mb-4 pl-8">
                {prompt.data.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 pl-8">
                {categoryName && (
                  <span className="px-3 py-1 border border-[#F2F2F2] text-[#34B1C8] font-Nunito font-semibold text-[12px] rounded-[9px]">
                    {categoryName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4 pl-8">
                {prompt.data.ai_models?.map((model: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 border border-[#F2F2F2] text-gray-700 rounded-[9px] font-Nunito text-[12px] font-semibold"
                  >
                    {model}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 pl-8">
                <span className="font-[inter] font-medium text-[15px] text-[#808080]">
                  {prompt.data.published_date
                    ? new Date(prompt.data.published_date).toLocaleDateString()
                    : "Not published"}
                </span>
                <div className="flex items-center gap-1">
                  <Image
                    src="new-person.svg"
                    alt="person"
                    width={15}
                    height={15}
                  />
                  <span className="font-[inter] font-medium text-[15px] text-[#808080]">
                    {prompt.data.user?.first_name} {prompt.data.user?.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mr-16">
          <div className="flex items-center gap-2 cursor-pointer">
            <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Image src="message.svg" alt="message" width={16} height={16} />
            </button>
            <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <MdIosShare size={16} className="text-gray-600" />
            </button>
            <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Image src="mark.svg" alt="bookmark" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="px-8">
            {/* Short Description */}
            <section className="">
              <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                Short Description
              </h3>
              <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed">
                {prompt.data.short_description}
              </p>
            </section>

            {/* Main Prompt */}
            <section>
              <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mt-[40px] mb-2">
                Main Prompt
              </h3>
              <div className=" border border-gray-200 rounded-lg p-4">
                <div className="flex justify-end ">
                  <button className="flex cursor-pointer items-center gap-1 font-Nunito font-semibold text-[15px] text-[#4D4D4D] py-[2px] pr-[8px] pl-[12px] border border-[#F2F2F2] rounded-[10px]">
                    Copy Prompt{" "}
                    <Image src="/copy.svg" alt="copy" width={16} height={16} />
                  </button>
                </div>
                <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed break-words overflow-wrap-anywhere">
                  {prompt.data.main_prompt}
                </p>
              </div>
            </section>

            {/* User Guide */}
            <section className="mt-[40px]">
              <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                How to Use This Prompt
              </h3>
              <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed break-words overflow-wrap-anywhere">
                {prompt.data.user_guide}
              </p>
            </section>
          </div>

          <div className="border border-[#F2F2F2]" />

          <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
            Related prompts
          </h3>
          <div className="flex justify-between">
            <section>
              <div className="flex flex-wrap gap-2">
                <div className="border py-[12px] px-[20px] border-[#F2F2F2] rounded-[9px] ">
                  <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                    Blog Post Structure Generator
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      Writing
                    </span>
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      blogging
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap gap-2">
                <div className="border py-[12px] px-[20px] border-[#F2F2F2] rounded-[9px] ">
                  <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                    Social Media Ad Copy Creator
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      Marketing
                    </span>
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      copywriting
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-wrap gap-2">
                <div className="border py-[12px] px-[20px] border-[#F2F2F2] rounded-[9px] ">
                  <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                    Meeting Summary Generator
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      Business
                    </span>
                    <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      meetings
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
