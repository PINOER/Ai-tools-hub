import React, { useState } from "react";
import { FiX, FiStar, FiBookmark } from "react-icons/fi";
import Image from "next/image";
import { ToolModalSkeleton } from "../skeletonCards/ToolCardSkeleton";
import { Review } from "@/types/api";
import { useReviewsMutation } from "@/hooks/queries/useReviewsMutation";
import { useGetToolByIdQuery } from "@/hooks/queries/useToolsQuery";
import { RelatedContent } from "./RelatedContent";
import { MdOutlineCheckCircleOutline, MdOutlineIosShare } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

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

interface ToolModalProps {
  onClose: () => void;
  toolId?: number;
}

export default function ToolModal({ onClose, toolId }: ToolModalProps) {
  const { isSignedIn: isAuthenticated } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const postReviewMutation = useReviewsMutation();

  const { data: tool, isLoading, error } = useGetToolByIdQuery(toolId!);

  if (isLoading) {
    return <ToolModalSkeleton />;
  }

  if (error || !tool) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Error Loading Tool</h2>
            <p className="text-gray-600 mb-4">
              Failed to load tool details. Please try again.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const averageRating =
    tool.reviews && tool.reviews.length > 0
      ? tool.reviews.reduce(
          (acc, review) => acc + (review as unknown as Review).overall_rating,
          0
        ) / tool.reviews.length
      : 0;

  const handleSubmitReview = async () => {
    if (!toolId || !rating || !comment.trim()) return;
    try {
      await postReviewMutation.mutateAsync({
        tool_id: toolId,
        overall_rating: rating,
        comment: comment.trim(),
        criteria: [
          {
            name: "Overall Experience",
            rating: rating,
            comment: comment.trim(),
          },
        ],
      });

      setRating(0);
      setComment("");

      // The mutation will automatically invalidate and refetch the tool data
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-[#D4D4D4] to-[#EEEEEE]">
          {/* Left side: Logo, Title, Description, Tags */}
          <div className="px-10 pt-18 pb-4 flex items-start justify-between">
            <div className="flex items-start justify-start gap-4">
              <Image
                src={tool.avatar}
                alt={tool.name}
                width={80}
                height={80}
                className="w-[75px] h-[75px] rounded-[10px] p-1"
              />
              <div>
                <h2 className="text-[25px] font-medium text-black font-sf-pro-rounded tracking-tighter">
                  {tool.name}
                </h2>
                <p className="text-[15px] font-[inter] font-medium text-[#808080]">
                  {tool.short_description}
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {tool.tool_tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#FFFFFF] text-[#007AFF] font-Nunito font-semibold text-[15px] px-[10px] py-[4px] rounded-[9px]"
                    >
                      {tag.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Rating + Visit button */}
            <div className="h-[32px] flex items-start gap-2 ml-4">
              <div className="inline-flex h-full items-center px-[8px] py-[2px] text-xs rounded-[10px] bg-white shadow-sm border border-gray-200 text-gray-700">
                <span className="font-[inter] font-medium text-[15px] text-[#000000] mr-1">
                  {averageRating.toFixed(1)}
                </span>
                <Image src="/fillstar.svg" alt="star" width={20} height={20} />
                <span className="ml-1 font-[inter] font-medium text-[15px] text-gray-400">
                  ({tool.reviews?.length || 0})
                </span>
              </div>
              <a
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-full items-center gap-1 text-[15px] text-white font-Nunito font-semibold bg-black px-3 py-1.5 rounded-[10px] hover:opacity-90 transition"
              >
                Visit{" "}
                <Image src="/arrow-up.svg" alt="arrow" width={16} height={16} />
              </a>
            </div>

            {/* Close button (top-right corner) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-10 text-gray-400 hover:text-black cursor-pointer"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex justify-end px-6 py-2 gap-2 text-gray-500 text-sm">
          <button className="hover:text-black cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
            <MdOutlineCheckCircleOutline size={16} />
          </button>
          <button className="hover:text-black cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
            <FaRegStar size={16} />
          </button>
          <button className="hover:text-black cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
            <MdOutlineIosShare size={16} />
          </button>
          <button className="hover:text-black cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
            <FiBookmark size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="py-8 px-22 text-sm text-gray-700 space-y-5 max-h-[60vh] overflow-y-auto">
          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              About
            </h3>
            <p className="mt-2 text-[15px] font-[inter] text-[#000000] font-medium leading-[20px]">
              {tool.full_description}
            </p>
          </section>

          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              Key Features
            </h3>
            <ul className="list-disc mt-2 text-[15px] font-[inter] text-[#000000] font-medium leading-[20px] pl-5 space-y-1">
              {tool.features?.map((feature, index) => (
                <li key={index} className="mb-0">
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              Use Cases
            </h3>
            <ul className="list-disc mt-2 text-[15px] font-[inter] text-[#000000] font-medium leading-[20px] pl-5 space-y-1">
              {tool.use_cases?.map((useCase, index) => (
                <li key={index} className="mb-0">
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {tool.tool_tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito  border border-[#F2F2F2]  text-xs text-gray-700"
                >
                  #{tag.tag.name.toLowerCase().replace(/\s+/g, "-")}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              Pricing
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito  border border-[#F2F2F2]  text-xs text-gray-700">
                {tool.pricing_model} – {tool.paid_plan_details}
              </span>
              {tool.free_plan_available && (
                <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito  border border-[#F2F2F2]  text-xs text-gray-700">
                  Free – {tool.free_plan_details}
                </span>
              )}
            </div>
          </section>

          <section>
            <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
              Platform
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {tool.platform_availability?.map((platform, index) => (
                <span
                  key={index}
                  className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito  border border-[#F2F2F2]  text-xs text-gray-700"
                >
                  {platform}
                </span>
              ))}
            </div>
          </section>

          {tool.screenshots && tool.screenshots.length > 0 && (
            <section>
              <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
                Screenshots
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {tool.screenshots.map((screenshot, index) => (
                  <Image
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    width={300}
                    height={180}
                    className="w-[300px] rounded-lg border"
                  />
                ))}
              </div>
            </section>
          )}

          {/* <section>
            <h3 className="font-semibold text-[15px] mb-1 text-[#00000033] uppercase">Similar Tools</h3>
          </section> */}

          <RelatedContent cards={cards} />

          {/* Reviews Section */}
          <div className="mt-10">
            {/* Review Input */}

            {isAuthenticated && (
              <div className="flex flex-col gap-2 mb-3">
                <span className="font-[inter] text-[15px] text-[#00000033] font-medium uppercase">
                  Rate this tool
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 border w-[130px] rounded-[10px] border-[#F2F2F2] justify-center py-[8px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none cursor-pointer"
                      >
                        <FiStar
                          className={`w-5 h-5 ${
                            star <= (hoverRating || rating)
                              ? "text-black fill-current"
                              : "text-[#F2F2F2] fill-current"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      {rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="min-h-[120px] relative gap-2 border border-[#F2F2F2] rounded-lg px-4 py-4 bg-white mb-6">
              <textarea
                placeholder="What do you think"
                className="w-full border-none outline-none bg-transparent text-sm  resize-none min-h-[60px]"
                disabled={!isAuthenticated}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />

              <button
                disabled={postReviewMutation.isPending}
                onClick={handleSubmitReview}
                className="absolute cursor-pointer text-[#4D4D4D] right-3 bottom-4 px-2 py-1.5 rounded-md  border border-[#F2F2F2] text-[13px] font-semibold hover:bg-gray-200 transition"
              >
                {isAuthenticated
                  ? comment.trim()
                    ? "Post Review"
                    : "Review"
                  : "Login to review"}
              </button>
            </div>
            {/* Reviews Header */}
            <div className="text-xs font-semibold text-gray-400 uppercase mb-4">
              Reviews
            </div>
            {/* Review Cards */}
            {tool.reviews && tool.reviews.length > 0 ? (
              tool.reviews.map((review, index) => {
                const reviewData = review as unknown as Review;
                return (
                  <div key={index} className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#B94A4A] flex items-center justify-center text-white font-bold text-sm">
                          {reviewData.user?.email?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                        <span className="font-semibold text-sm text-gray-900">
                          {reviewData.user?.email || "Anonymous"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(reviewData.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < reviewData.overall_rating
                              ? "text-black fill-black"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" />
                        </svg>
                      ))}
                      <span className="ml-2 font-semibold text-sm text-black">
                        {reviewData.overall_rating}.0
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {reviewData.comment}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 9l-5 5-5-5" />
                        </svg>
                        {reviewData.helpful_count}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 py-4">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
