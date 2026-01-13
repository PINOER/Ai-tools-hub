import React, { useCallback } from "react";
import { useReviews } from "@/contexts/ReviewsContext";
import { useReviewsFilters } from "@/hooks/filters/useReviewsFilters";
import {
  useReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewStatusMutation,
  useDeleteMultipleReviewsMutation,
  useUpdateMultipleReviewsMutation,
} from "@/hooks/queries/useReviewsQuery";
import { getReviewColumns } from "./ReviewsTableColumns";
import { QueryErrorHandler } from "@/components/shared/QueryErrorHandler";
import { DataTabSection } from "@/components/shared/DataTabSection";

interface ReviewsTabProps {
  userId?: number;
  hideControls?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  userId,
  hideControls = false,
  showPagination = true,
  showFilters = true,
  showSearch = true,
}) => {
  const {
    selectedTab: currentTab,
    openModal,
    closeModal,
    modals,
    setReviewToView,
  } = useReviews();

  const { filters, updateFilters, clearFilters, filterOptions } =
    useReviewsFilters();

  const userFilters = userId ? { ...filters, user_id: userId } : filters;

  const {
    data: reviewsData,
    isLoading: loading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviewsQuery(userFilters);

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const deleteReviewMutation = useDeleteReviewMutation();
  const updateReviewStatusMutation = useUpdateReviewStatusMutation();
  const deleteMultipleReviewsMutation = useDeleteMultipleReviewsMutation();
  const updateMultipleReviewsMutation = useUpdateMultipleReviewsMutation();


  const deleteMultipleReviews = async (ids: number[]) => {
    await deleteMultipleReviewsMutation.mutateAsync(ids);
  };

  const updateMultipleReviews = async (ids: number[]) => {
    await updateMultipleReviewsMutation.mutateAsync(ids);
  };





  const deleteReview = async (id: number) => {
    await deleteReviewMutation.mutateAsync(id);
  };

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

  const approveReview = (id: number) =>
    updateReviewStatus(id, "Approved", "Approved");

  const columns = getReviewColumns({
    selectedTab: currentTab,
    setReviewDetailsOpen: () => openModal("reviewDetails"),
    onDeleteSingle: deleteReview,
    onApproveReview: approveReview,
    setReviewToView,
    onDeleteMultipleReviews: deleteMultipleReviews,
    onUpdateMultipleReviews: updateMultipleReviews,
  });

  const handleCreate = useCallback(() => {
    openModal("createReview");
  }, [openModal]);

  const handleImport = useCallback(() => {
    openModal("importReview");
  }, [openModal]);

  const handleExport = useCallback(() => {
    openModal("importReview");
  }, [openModal]);

  if (reviewsError) {
    return (
      <QueryErrorHandler
        error={reviewsError}
        refetch={refetchReviews}
        title="Failed to load reviews"
        message="Unable to fetch reviews data. Please check your connection and try again."
      />
    );
  }

  return (
    <DataTabSection
      title="Reviews"
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      filterOptions={filterOptions}
      data={reviews}
      loading={loading}
      modals={modals}
      pagination={pagination}
      columns={columns}
      openModal={openModal}
      closeModal={closeModal}
      onCreate={handleCreate}
      onImport={handleImport}
      onExport={handleExport}
      hideControls={hideControls}
      showPagination={showPagination}
      showFilters={showFilters}
      showSearch={showSearch}
    />
  );
};
