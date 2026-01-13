import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { MdIosShare } from "react-icons/md";
import { RelatedContent } from "./RelatedContent";
import { LearningItem } from "@/types/api";

interface LearningModalProps {
  onClose: () => void;
  learning: LearningItem;
}

const cards = [
  {
    image: "/pngImages/dummy-img.png",
    title: "Preparing for future AI capabilities in biology",
    tags: ["Product", "Open AI"],
    time: "3 min",
  },
  {
    image: "/pngImages/dummy-img.png",
    title:
      "New data highlights the race to build more empathetic language models",
    tags: ["AGI", "Microsoft"],
    time: "3 min",
  },
  {
    image: "/pngImages/dummy-img.png",
    title:
      "New data highlights the race to build more empathetic language models",
    tags: ["AGI", "Microsoft"],
    time: "3 min",
  },
];

export default function LearningModal({
  learning,
  onClose,
}: LearningModalProps) {
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
                    background: `linear-gradient(to right, #5856D6, #FFFFFF00, transparent)`,
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

            <div className="pt-[40px]">
              <div className="flex justify-center items-center">
                <Image
                  src={learning.image || "/pngImages/dummy-img.png"}
                  alt="learning"
                  width={755}
                  height={300}
                  className="rounded-[10px]"
                />
              </div>
              {/* Title */}
              <h1 className="font-[inter] font-medium text-[25px] text-[#000000] mt-[20px] mb-4 pl-8">
                {learning.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4 pl-8">
                <span className="px-[10px] py-[4px] border border-[#F2F2F2] text-[#34C759] font-Nunito font-semibold text-[15px] rounded-[9px]">
                  {learning.tags}
                </span>
              </div>

              <section className="pl-8 flex items-center gap-4">
                <p className="font-[inter] font-medium text-[15px] text-[#808080]">
                  {learning.status}
                </p>

                <p className="flex items-center gap-1 font-[inter] font-medium text-[15px] text-[#808080]">
                  <Image
                    src="/new-person.svg"
                    alt="person"
                    width={15}
                    height={15}
                  />
                  {learning.user.username}
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="flex justify-end mr-16">
          <div className="flex items-center gap-2">
            <button className="p-1.5 cursor-pointer rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Image src="/message.svg" alt="message" width={16} height={16} />
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
          <div className="px-8">
            <section className="mb-4">
              {/* <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                Definition
              </h3> */}
              <p className="font-[inter] font-medium text-[15px] text-[#000000] leading-relaxed">
                {learning.description}
              </p>

              {/* {term.glossary_categories.length > 0 && (
                <>
                  <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mt-6 mb-2">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {term.glossary_categories.map((cat, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {cat.category.name} ({cat.type})
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p>Status: {term.status}</p>
                <p>Moderation: {term.moderation_status}</p>
                <p>Featured: {term.is_featured ? "Yes" : "No"}</p>
                <p>Created: {new Date(term.created_at).toLocaleDateString()}</p>
                {term.user && (
                  <p>
                    Added by: {term.user.first_name} {term.user.last_name}
                  </p>
                )}
              </div> */}
            </section>
            <section>
              <h3 className="font-[inter] font-medium text-[15px] text-[#00000033] uppercase mb-2">
                Tags
              </h3>
              <div className="flex gap-2">
                {learning.learningTags && learning.learningTags.length > 0 ? (
                  learning.learningTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-[10px] py-[4px] border border-[#F2F2F2] text-[#34C759] font-Nunito font-semibold text-[15px] rounded-[9px]"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="px-[10px] py-[4px] border border-[#F2F2F2] text-[#34C759] font-Nunito font-semibold text-[15px] rounded-[9px]">
                    No tags
                  </span>
                )}
              </div>
            </section>
          </div>

          <div className="border border-[#F2F2F2] my-[40px]" />

          <RelatedContent cards={cards} />
        </div>
      </div>
    </div>
  );
}
