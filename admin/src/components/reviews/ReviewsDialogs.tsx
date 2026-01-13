import React from "react";
import { ReviewDetailsDialog } from "./ReviewDetailsDialog";
import { useReviews } from "@/contexts/ReviewsContext";
import { useUpdateReviewStatusMutation } from "@/hooks/queries/useReviewsQuery";
import { ReviewStatus } from "@/types/reviews";

export const ReviewsDialogs = React.memo(() => {
  const { modals, closeModal, reviewToView } = useReviews();

  const updateReviewStatusMutation = useUpdateReviewStatusMutation();

  const updateReviewStatus = async (
    id: number,
    status: string,
    action: string
  ) => {
    await updateReviewStatusMutation.mutateAsync({
      id,
      status,
      remarks: action,
    });
  };

  // Single function that handles all status updates
  const handleStatusUpdate = (status: string) => (id: number) =>
    updateReviewStatus(id, status, status);

  return (
    <>
      <ReviewDetailsDialog
        review={reviewToView}
        open={modals.reviewDetails}
        onOpenChange={() => closeModal("reviewDetails")}
        onApprove={handleStatusUpdate(ReviewStatus.Approved)}
        onReject={handleStatusUpdate(ReviewStatus.Reported)}
        onFlag={handleStatusUpdate(ReviewStatus.Flagged)}
      />
    </>
  );
});
