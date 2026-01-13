"use client";
import { useGlossaryByIdQuery } from "@/hooks/queries/useGlossaryQuery";
import { GlossaryCat } from "@/types/api";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MdIosShare } from "react-icons/md";
import BreadCrumb from "../BreadCrumb";
import { GlossaryDetailCardSkeleton } from "../skeletonCards/GlossaryCardSkeleton";
import { useRelatedToolsQuery } from "@/hooks/queries/useRelatedToolsQuery";
import Link from "next/link";

export default function GlossaryDetailPage() {
  const params = useParams();
  const glossaryId = parseInt(params.id as string);
  const { data: glossary, isLoading, error } = useGlossaryByIdQuery(glossaryId);
  const { data: relatedData } = useRelatedToolsQuery(
    "GlossaryTerm",
    glossaryId
  );

  
  if (isLoading) {
    return (
      <div className="p-0 md:p-6">
        <div className="w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <BreadCrumb
            items={[
              {
                name: "Glossary",
                path: "/glossary",
                icon: "/scan.svg",
              },
              {
                name: "Loading...",
              },
            ]}
          />
          <div className="p-6">
            <GlossaryDetailCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !glossary) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Error Loading Glossary</h2>
          <p className="text-gray-600 mb-4">
            Failed to load glossary details. Please try again.
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
            name: "Glossary",
            path: "/glossary",
            icon: "/scan.svg",
          },
          {
            name: glossary?.data.term || "Loading...",
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
                  {glossary?.data.term}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 pl-8">
                  {glossary?.data.glossary_categories.map(
                    (category: GlossaryCat, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-[#F2F2F2] text-[#FF2D55] font-Nunito font-semibold text-[12px] rounded-[9px]"
                      >
                        {category.category.name}
                      </span>
                    )
                  )}
                </div>

                {/* <div className="flex flex-wrap gap-2 mb-4 pl-8">
              {glossary?.data.glossaryTags.map((model: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-[#F2F2F2] text-gray-700 rounded-[9px] font-Nunito text-[12px] font-semibold"
                >
                  {model || "no tags"}
                </span>
              ))}
            </div> */}

                {/* <div className="flex items-center gap-4 text-sm text-gray-500 pl-8">
              <span className="font-[inter] font-medium text-[15px] text-[#808080]">
                {glossary?.data.published_date
                  ? new Date(prompt?.data.published_date).toLocaleDateString()
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
                  {prompt?.data.user?.first_name} {prompt?.data.user?.last_name}
                </span>
              </div>
            </div> */}
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
                  {glossary?.data.definition}
                </p>
              </section>
            </div>

            <div className="border border-[#F2F2F2]" />

            <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
              Related glossary terms
            </h3>
            <div className=" flex gap-15">
              {relatedData?.glossary && relatedData.glossary.length > 0 ? (
                relatedData.glossary.map((item, index) => (
                  <Link key={index} href={`/glossary/${item.id}`}>
                    <section>
                      <div className="flex flex-wrap gap-2">
                        <div className="border py-[12px] px-[20px] border-[#F2F2F2] rounded-[9px] ">
                          <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                            {item.term}
                          </p>
                          {/* <div className="flex items-center gap-2">
                    <span className="font-Nunito font-semibold text-[12px] text-[#FF2D55] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      Writing
                    </span>
                    <span className="font-Nunito font-semibold text-[12px] text-[#FF2D55] border border-[#F2F2F2] rounded-[9px] px-[6px] py-[2px]">
                      blogging
                    </span>
                  </div> */}
                        </div>
                      </div>
                    </section>
                  </Link>
                ))
              ) : (
                <div className="text-gray-500 text-sm">
                  No related glossary terms found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
