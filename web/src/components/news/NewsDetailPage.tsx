"use client";
import React from "react";
import Image from "next/image";
import { MdIosShare } from "react-icons/md";
import { ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetNewsByIdQuery } from "@/hooks/queries/useNewsQuery";
import { RelatedContent } from "../modals/RelatedContent";
import BreadCrumb from "../BreadCrumb";
import { NewsCardSkeleton } from "../skeletonCards/NewsCardSkeleton";
import { useRelatedToolsQuery } from "@/hooks/queries/useRelatedToolsQuery";

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = parseInt(params.id as string);
  const { data: news, isLoading, error } = useGetNewsByIdQuery(newsId);
  const {data : relatedData} = useRelatedToolsQuery("News", newsId)
  
  const cards =  relatedData?.news.map((item) => (
      {
      id: item.id,
      image: item.image,
      title: item.headline,
      tags: [],
      time: "",
      }
    ))

  if (isLoading) {
    return (
      <div className="p-0 md:p-6">
        <div className="w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <BreadCrumb
            items={[
              {
                name: "News",
                path: "/news",
                icon: "/Fill.svg",
              },
              {
                name: "Loading...",
              },
            ]}
          />
          <div className="p-6">
            <NewsCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Error Loading News</h2>
          <p className="text-gray-600 mb-4">
            Failed to load news details. Please try again.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="p-0 md:p-[40px]">
      <div className="w-full mx-auto">
      <BreadCrumb
          items={[
            {
              name: "News",
              path: "/news",
              icon: "/Fill.svg",
            },
            {
              name: news?.headline || "Loading...",
            },
          ]}
        />

        <div className="bg-white rounded-[25px] border border-[#F2F2F2] overflow-hidden">
          {/* Header */}
          <div className="relative">
            <div className="px-8 pt-6 pb-0">

              <div className="flex justify-center items-center">
                <Image
                  src={news?.image || "/pngImages/dummy-img.png"}
                  alt="news"
                  width={920}
                  height={420}
                  className="rounded-[10px] object-cover"
                />
              </div>
              {/* Title */}
              <h1 className=" md:mx-auto font-[inter] font-medium text-[20px] md:text-[25px] text-[#000000] mt-[20px]  mb-4 w-full md:w-3/4 pl-0 md:pl-4 ">
                {news?.headline}
              </h1>

              {/* Tags */}
              <div className=" mx-auto  w-full md:w-3/4 text-center items-center justify-start flex flex-wrap gap-2 mb-4 pl-0 md:pl-4">
                {news?.newsTags && news?.newsTags.length > 0 ? (
                  news?.newsTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-[10px] py-[4px] border border-[#F2F2F2] text-[#34C759] font-Nunito font-semibold text-[15px] rounded-[9px]"
                    >
                      {tag.tag?.name}
                    </span>
                  ))
                ) : (
                  <span className="px-[10px] py-[4px] border border-[#F2F2F2] text-[#34C759] font-Nunito font-semibold text-[15px] rounded-[9px]">
                    No tags
                  </span>
                )}
              </div>

              <section className="  w-full md:w-3/4 mx-auto  pl-0 md:pl-4 flex gap-4">
                <p className="font-[inter] font-medium text-[15px] text-[#808080]">
                  {news?.published_date || "Recently"}
                </p>

                <p className="flex items-center gap-1 font-[inter] font-medium text-[15px] text-[#808080]">
                  {news?.headline.split(" ")[0]}{" "}
                  <ArrowUpRight className="w-[20px] h-[20px]" />
                </p>
              </section>
            </div>
          </div>

          <div className="flex justify-end  w-full md:w-3/4 mx-auto  pr-8 md:pr-8 ">
            <div className="flex items-center gap-2">
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
          <div className="p-8 space-y-6 ">
            <div className="w-full md:w-3/4 mx-auto pl-0 md:pl-4">
              <section className="mb-4">
                <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed">
                  {news?.content}
                </p>

              </section>
              <section>
                <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                  Tags
                </h3>
                <div className="flex gap-2">
                  {news?.newsCategories && news?.newsCategories.length > 0 ? (
                    news?.newsCategories.map((tag, index) => (
                      <span
                        key={index}
                        className="px-[8px] py-[4px] lowercase border border-[#F2F2F2] text-gray-700 rounded-[9px] font-[inter] text-[15px] font-medium"
                      >
                        {`#${tag.category?.name}`}
                      </span>
                    ))
                  ) : (
                    <span className="px-[8px] py-[4px] border border-[#F2F2F2] text-gray-500 rounded-[9px] font-[inter] text-[15px] font-medium">
                      No tags
                    </span>
                  )}
                </div>
              </section>
            </div>

            <div className="border border-[#F2F2F2] my-[40px]" />

            <RelatedContent cards={cards || []} name={"news"}/>
          </div>
        </div>
      </div>
    </div>
  );
}
