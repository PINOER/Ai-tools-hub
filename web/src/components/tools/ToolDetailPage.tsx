"use client";

import { useParams } from "next/navigation";
import { useGetToolByIdQuery } from "@/hooks/queries/useToolsQuery";
import { ToolModalSkeleton } from "@/components/skeletonCards/ToolCardSkeleton";
import { Review } from "@/types/api";
import { useReviewsMutation } from "@/hooks/queries/useReviewsMutation";
import { useState } from "react";
import { FiStar, FiBookmark } from "react-icons/fi";
import { MdOutlineCheckCircleOutline, MdOutlineIosShare } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import Image from "next/image";
import { RelatedContent } from "@/components/modals/RelatedContent";
import SimilerTools from "@/components/modals/SimilerTools";
import { GoThumbsup } from "react-icons/go";
import BreadCrumb from "@/components/BreadCrumb";
import { useUser } from "@clerk/nextjs";
// import { CreateToolDialog } from "./CreateToolDialog";
import ClaimModal from "../modals/ClaimModal";
import RegisterTool from "../registerTool/RegisterTool";
import { useRelatedToolsQuery } from "@/hooks/queries/useRelatedToolsQuery";
import { ConfirmRegister } from "../registerTool/ConfirmRegister";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export default function ToolDetailPage() {
  const params = useParams();
  const toolId = parseInt(params.id as string);
  const { isSignedIn: isAuthenticated } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const postReviewMutation = useReviewsMutation();
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const { data: tool, isLoading, error } = useGetToolByIdQuery(toolId);
  const { data: relatedData } = useRelatedToolsQuery("Tool", toolId);

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      setShowRegister(true);
    } else {
      if (tool?.is_claimed === true) {
        setShowConfirmRegister(true);
      } else {
        setShowModal(true);
      }
    }
  };

  const cards = relatedData?.tools.map((item) => ({
    id: item.id,
    image: item.avatar,
    title: item.name,
    tags: [],
    time: "",
  }));
  // Render loading state with breadcrumb
  if (isLoading) {
    return (
      <div className="p-0 md:p-6">
        <div className="w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <BreadCrumb
            items={[
              {
                name: "AI Tools",
                path: "/ai-tools",
                icon: "/ai.svg",
              },
              {
                name: "Loading...",
              },
            ]}
          />
          <div className="p-6">
            <ToolModalSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Error Loading Tool</h2>
          <p className="text-gray-600 mb-4">
            Failed to load tool details. Please try again.
          </p>
        </div>
      </div>
    );
  }

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
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // const dummyTags = [
  //   { id: 1, name: "AI" },
  //   { id: 2, name: "Machine Learning" },
  //   { id: 3, name: "Productivity" },
  //   { id: 4, name: "Design" },
  //   { id: 5, name: "Development" },
  //   { id: 6, name: "Automation" },
  //   { id: 7, name: "Analytics" },
  //   { id: 8, name: "Collaboration" },
  // ];

  return (
    <div className="p-0 md:p-6">
      <div className="w-full mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between">
          <BreadCrumb
            items={[
              {
                name: "AI Tools",
                path: "/ai-tools",
                icon: "/ai.svg",
              },
              {
                name: tool.name,
              },
            ]}
          />
        </div>

        {/* Tool Card */}
        <div className="bg-white rounded-[25px] border border-[#F2F2F2] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-l from-[#D4D4D4] to-[#EEEEEE]">
            <div className="flex flex-col md:flex-row px-10 pt-18 pb-4 items-start justify-between">
              <div className="flex flex-col md:flex-row  items-start justify-start gap-4">
                <Image
                  src={tool?.avatar || "/pngImages/dummy-img.png"}
                  alt={tool?.name || "Tool Image"}
                  width={80}
                  height={80}
                  className="object-contain w-[75px] h-[75px] rounded-[10px] p-1"
                />
                <div>
                  <h1 className="text-[25px] font-medium text-black font-sf-pro-rounded tracking-tighter">
                    {tool.name}
                  </h1>
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
              <div className="h-[32px] flex items-start gap-2 ml-0  mt-4 md:mt-0 md:ml-4">
                <div className="inline-flex h-full items-center px-[8px] py-[2px] text-xs rounded-[10px] bg-white shadow-sm border border-gray-200 text-gray-700">
                  <span className="font-[inter] font-medium text-[15px] text-[#000000] mr-1">
                    {tool.rating?.toFixed(1) || 0}
                  </span>
                  <Image
                    src="/fillstar.svg"
                    alt="star"
                    width={20}
                    height={20}
                  />
                  <span className="ml-1 font-[inter] font-medium text-[15px] text-gray-400">
                    ({tool.total_reviews || 0})
                  </span>
                </div>
                <button
                  onClick={handleClaimClick}
                  className="bg-[#000000] text-white px-3 py-[5px] rounded-[10px] cursor-pointer font-Nunito font-semibold text-[15px] hover:opacity-90 transition"
                >
                  Claim tool
                </button>
                <a
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-full items-center gap-1 text-[15px] text-white font-Nunito font-semibold bg-black px-3 py-1.5 rounded-[10px] hover:opacity-90 transition"
                >
                  Visit{" "}
                  <Image
                    src="/arrow-up.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                  />
                </a>
              </div>
            </div>

            <div className="flex justify-end px-6 py-2 gap-2 text-gray-500 text-sm border-b border-gray-100">
              <button className="hover:text-black bg-white cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
                <MdOutlineCheckCircleOutline size={16} />
              </button>
              <button className="hover:text-black bg-white cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
                <FaRegStar size={16} />
              </button>
              <button className="hover:text-black bg-white cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
                <MdOutlineIosShare size={16} />
              </button>
              <button className="hover:text-black bg-white cursor-pointer px-[8px] py-[8px] rounded-[10px] border border-[#F2F2F2]">
                <FiBookmark size={16} />
              </button>
            </div>
          </div>

          {/* Toolbar */}

          {/* Body */}
          <div className="py-8 px-2 md:px-10 text-sm text-gray-700 space-y-5">
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
                    className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700"
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
                <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                  {tool.pricing_model} – {tool.paid_plan_details}
                </span>
                {tool.free_plan_available && (
                  <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                    Free – {tool.free_plan_details}
                  </span>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
                industry
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                  Marketing
                </span>
                {tool.free_plan_available && (
                  <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                    Software
                  </span>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
                roles
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                  Research Analyst
                </span>
                {tool.free_plan_available && (
                  <span className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700">
                    Content Creator
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
                    className="px-[10px] rounded-[9px] font-semibold py-[4px] text-[15px] font-Nunito border border-[#F2F2F2] text-xs text-gray-700"
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
                <PhotoProvider>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {tool.screenshots.map((screenshot, index) => (
                      <PhotoView key={index} src={screenshot}>
                        <Image
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          width={300}
                          height={180}
                          className="w-[300px] rounded-lg border cursor-pointer"
                        />
                      </PhotoView>
                    ))}
                  </div>
                </PhotoProvider>
              </section>
            )}

            <div className="border border-[#F2F2F2]" />

            <section>
              <h3 className="font-medium font-[inter] text-[15px] mb-1 text-[#00000033] uppercase">
                similar tools
              </h3>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <SimilerTools
                  name="Grok"
                  tag="AI Chat"
                  tag2="AI Chat tool"
                  star={4.5}
                  color="#E97C10"
                />
                <SimilerTools
                  name="Grok"
                  tag="AI Chat"
                  tag2="AI Chat tool"
                  star={4.5}
                  color="white"
                />
                <SimilerTools
                  name="Grok"
                  tag="AI Chat"
                  tag2="AI Chat tool"
                  star={4.5}
                  color="white"
                />
              </div>
            </section>

            <div className="border border-[#F2F2F2]" />

            <RelatedContent cards={cards || []} name={"ai-tools"} />

            <div className="border border-[#F2F2F2]" />

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
                  className="w-full border-none outline-none bg-transparent text-sm resize-none min-h-[60px]"
                  disabled={!isAuthenticated}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />

                <button
                  disabled={postReviewMutation.isPending}
                  onClick={handleSubmitReview}
                  className="absolute cursor-pointer text-[#4D4D4D] right-3 bottom-4 px-2 py-1.5 rounded-md border border-[#F2F2F2] text-[13px] font-semibold hover:bg-gray-200 transition"
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
                  const userName =
                    `${reviewData.user?.first_name} ${reviewData.user?.last_name}`
                      ? `${reviewData.user?.first_name} ${reviewData.user?.last_name}`
                      : reviewData.user?.email || "Anonymous";
                  return (
                    <div key={index} className="flex flex-col gap-1 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-[#B94A4A] flex items-center justify-center text-white font-bold text-sm">
                            {reviewData.user?.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                          <span className="font-semibold text-sm text-gray-900">
                            {userName}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(reviewData.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < reviewData.overall_rating
                                ? "text-black fill-black"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-semibold text-sm text-black">
                          {reviewData.overall_rating}.0
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {reviewData.comment}
                      </div>
                      <div className="flex items-center w-fit gap-1 mt-2 text-xs border bg-[#F2F2F2] border-[#F2F2F2] rounded-[10px] py-[3px] px-[8px]  text-gray-400">
                        <button className="flex items-center gap-1 hover:text-black transition cursor-pointer">
                          <GoThumbsup size={16} />
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
      {showModal && <ClaimModal setShowModal={setShowModal} toolId={toolId} />}
      {showRegister && <RegisterTool setShowRegister={setShowRegister} />}
      {showConfirmRegister && tool && (
        <ConfirmRegister
          setShowRegister={setShowConfirmRegister}
          avatar={tool.avatar}
          name={tool.name}
          description={tool.short_description}
          tags={tool.tool_tags}
        />
      )}
    </div>
  );
}
