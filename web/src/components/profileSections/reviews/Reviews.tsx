import Image from "next/image";
import {  Review } from "@/types/components";
import { GoThumbsup } from "react-icons/go";

interface ReviewsProps {
  reviews: Review[];
  loading: boolean;
  isError: boolean;
}

export default function Reviews({ reviews, loading, isError }: ReviewsProps) {

  // Function to get status-specific styling
  const getStatusStyling = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-[#34C75933] text-[#34C759]";
      case "pending":
        return "bg-[#FF950033] text-[#FF9500]";
      case "rejected":
        return "bg-[#FF344433] text-[#FF3444]";
      default:
        return "bg-[#34C75933] text-[#34C759]"; // default to approved styling
    }
  };

  if (loading) {
    return <div className="mt-[40px] ml-1">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-[40px] ml-1 text-red-500">Failed to load reviews.</div>
    );
  }

  if (!reviews || !reviews.length) {
    return (
      <div className="mt-[40px] ml-1 flex flex-col justify-center items-center border border-dashed border-[#F2F2F2] h-[68px] rounded-[10px]">
        <div className="flex gap-3">
          <Image src="/Star.svg" alt="group" width={28} height={28} />
          <p className="font-medium text-[20px] font-[Inter] text-[#808080]">
            No Reviews
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[40px] ml-1">
      <p className="font-medium text-[15px] text-[#CCCCCC] mb-[20px] ml-1">
        Reviews {reviews.length}
      </p>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="flex flex-col gap-1 mb-8 border px-[20px] py-[12px] border-[#F2F2F2] rounded-[15px] "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {review.tool.avatar && (
                <Image
                  src={review.tool.avatar}
                  alt={review.tool.name}
                  width={28}
                  height={28}
                  className="rounded-full"
                />
              )}
              <span className="font-semibold text-sm text-gray-900">
                {review.tool.name}
              </span>
            </div>  
            <div>
              <span className="font-medium text-[15px] text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
              <span
                className={`ml-[8px] font-medium text-[12px] px-[8px] py-[2px] rounded-[12px] ${getStatusStyling(
                  review.status
                )}`}
              >
                {review.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 border border-gray-200 rounded-[8px]  px-2 py-1">
              {[...Array(Math.round(review.overall_rating ?? 0))].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-black fill-black" viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" /></svg>
              ))}
            </span>
            <span className="ml-2 font-semibold text-sm text-black">{review.overall_rating?.toFixed(1)}</span>
            </div>
          <div className="font-medium text-[15px] text-gray-700 mt-1 ml-1.5">
            {review.comment}
          </div>
          <button className="flex items-center border border-gray-200 rounded-[8px]  px-2 py-1 gap-1 w-fit cursor-pointer mt-1">
              <GoThumbsup />
              0
            </button>
        </div>
      ))}
    </div>
  );
}
