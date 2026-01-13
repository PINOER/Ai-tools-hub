"use client";
import { usePromptByIdQuery } from "@/hooks/queries/usePromptQuery";
import { PromptCat } from "@/types/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MdIosShare } from "react-icons/md";
import BreadCrumb from "../BreadCrumb";
import { PromptDetailCardSkeleton } from "../skeletonCards/PromptCardSkeleton";
import { useRelatedToolsQuery } from "@/hooks/queries/useRelatedToolsQuery";
import Link from "next/link";

export default function PromptDetailPage() {
  const params = useParams();
  const promptId = parseInt(params.id as string);
  const { data: prompt, isLoading, error } = usePromptByIdQuery(promptId);
  const { data: relatedData } = useRelatedToolsQuery("Prompt", promptId);

  if (isLoading) {
    return (
      <div className="p-0 md:p-6">
        <div className="w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <BreadCrumb
            items={[
              {
                name: "Prompts",
                path: "/prompts",
                icon: "/pen.svg",
              },
              {
                name: "Loading...",
              },
            ]}
          />
          <div className="p-6">
            <PromptDetailCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Error Loading Prompt</h2>
          <p className="text-gray-600 mb-4">
            Failed to load prompt details. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[40px]">
      <BreadCrumb
        items={[
          {
            name: "Prompts",
            path: "/prompts",
            icon: "/pen.svg",
          },
          {
            name: prompt?.data.title || "Loading...",
          },
        ]}
      />

      <div className="p-0 md:p-[40px] border border-[#F2F2F2] rounded-[25px]">
        <div className=" w-full mx-auto">
          {/* Header */}
          <div className="px-[120px]">
            <div className=" pb-0">
              <div className="pt-[40px]">
                {/* Title */}
                <h1 className="font-[inter] font-medium text-[25px] text-[#000000] mb-4 pl-8">
                  {prompt?.data.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 pl-8">
                  {prompt?.data.promptCategories.map(
                    (category: PromptCat, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-[#F2F2F2] text-[#34B1C8] font-Nunito font-semibold text-[12px] rounded-[9px]"
                      >
                        {category.category.name}
                      </span>
                    )
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 pl-8">
                  {prompt?.data.ai_models.map(
                    (model: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-[#F2F2F2] text-gray-700 rounded-[9px] font-Nunito text-[12px] font-semibold"
                      >
                        {model}
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 pl-8">
                  <span className="font-[inter] font-medium text-[15px] text-[#808080]">
                    {prompt?.data.published_date
                      ? new Date(
                          prompt?.data.published_date
                        ).toLocaleDateString()
                      : "Not published"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Image
                      src="/new-person.svg"
                      alt="person"
                      width={15}
                      height={15}
                    />
                    <span className="font-[inter] font-medium text-[15px] text-[#808080]">
                      {prompt?.data.user?.first_name}{" "}
                      {prompt?.data.user?.last_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pr-[160px]">
            <div className="flex items-center gap-2 cursor-pointer">
              <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Image
                  src="/message.svg"
                  alt="message"
                  width={16}
                  height={16}
                />
              </button>
              <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <MdIosShare size={16} className="text-gray-600" />
              </button>
              <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Image src="/mark.svg" alt="bookmark" width={16} height={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            <div className="px-[120px]">
              {/* Short Description */}
              <section className="">
                <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                  Short Description
                </h3>
                <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed">
                  {prompt?.data.short_description}
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
                      <Image
                        src="/copy.svg"
                        alt="copy"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                  <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed break-words overflow-wrap-anywhere">
                    {prompt?.data.main_prompt}
                  </p>
                </div>
              </section>

              {/* User Guide */}
              <section className="mt-[40px]">
                <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                  How to Use This Prompt
                </h3>
                <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed break-words overflow-wrap-anywhere">
                  {prompt?.data.user_guide}
                </p>
              </section>
            </div>

            <div className="border border-[#F2F2F2]" />

            <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
              Related prompts
            </h3>
            <div className=" flex gap-15">
              {relatedData?.prompts.map((item, index) => (
                <Link href={`/prompts/${item.id}`} key={index}>
                <section >
                  <div className="flex flex-wrap gap-2">
                    <div className="border py-[12px] px-[20px] border-[#F2F2F2] rounded-[9px] ">
                      <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                        {item.title}
                      </p>
                      {/* <div className="flex items-center gap-2">
                  <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                    Writing
                  </span>
                  <span className="font-Nunito font-semibold text-[12px] text-[#34B1C8] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                    blogging
                  </span>
                </div> */}
                    </div>
                  </div>
                </section>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
