import React, { useCallback } from "react";
import { useTools } from "@/contexts/ToolsContext";
import { useSubmissionsFilters } from "@/hooks/filters/useSubmissionsFilters";
import { getSubmissionColumns } from "./ToolsTableColumns";
import {
  useSubmissionsQuery,
  useApproveSubmissionMutation,
  useApproveMultipleSubmissionsMutation,
  useRejectSubmissionMutation,
  useRejectMultipleSubmissionsMutation,
  useDeleteSubmissionMutation,
  useDeleteMultipleSubmissionsMutation,
} from "@/hooks/queries/useToolsQuery";
import { DataTabSection } from "@/components/shared/DataTabSection";

interface SubmissionsTabProps {
  userId?: number;
  hideControls?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({
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
    setToolToView,
  } = useTools();

  const { filters, updateFilters, clearFilters, filterOptions } =
    useSubmissionsFilters();

  // Add user filter if userId is provided
  const userFilters = userId ? { ...filters, user_id: userId } : filters;

  // Fetch submissions with TanStack Query using filters
  const { data: submissionsData, isLoading: loading } =
    useSubmissionsQuery(userFilters);
  console.log({ submissionsData });
  const submissions = submissionsData?.submissions || [];
  const pagination = submissionsData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  // Use the mutations
  const approveSubmissionMutation = useApproveSubmissionMutation();
  const approveMultipleSubmissionsMutation =
    useApproveMultipleSubmissionsMutation();
  const rejectSubmissionMutation = useRejectSubmissionMutation();
  const rejectMultipleSubmissionsMutation =
    useRejectMultipleSubmissionsMutation();
  const deleteSubmissionMutation = useDeleteSubmissionMutation();
  const deleteMultipleSubmissionsMutation =
    useDeleteMultipleSubmissionsMutation();

  const approveSubmission = (id: number) =>
    approveSubmissionMutation.mutate(id);
  const approveSubmissions = (ids: number[]) =>
    approveMultipleSubmissionsMutation.mutate(ids);
  const rejectSubmission = (id: number) => rejectSubmissionMutation.mutate(id);
  const rejectSubmissions = (ids: number[]) =>
    rejectMultipleSubmissionsMutation.mutate(ids);
  const deleteSubmission = (id: number) => deleteSubmissionMutation.mutate(id);
  const deleteSubmissions = (ids: number[]) =>
    deleteMultipleSubmissionsMutation.mutate(ids);

  // Get columns using the new column functions
  const submissionColumns = getSubmissionColumns({
    selectedTab: currentTab,
    setEditDialogOpen: () => openModal("editTool"),
    setToolClaimDetailsDialogOpen: () => openModal("toolClaimDetails"),
    setDeleteDialogOpen: () => openModal("deleteTool"),
    setToolToView,
    setToolDetailsOpen: () => openModal("toolDetails"),
    approveSubmission,
    rejectSubmission,
    deleteSubmission,
    approveSubmissions,
    rejectSubmissions,
    deleteSubmissions,
  });

  const handleCreate = useCallback(() => {
    openModal("createTool");
  }, [openModal]);

  const handleImport = useCallback(() => {
    openModal("importTool");
  }, [openModal]);

  const handleExport = useCallback(() => {
    openModal("exportTool");
  }, [openModal]);

  return (
    <DataTabSection
      title="Submissions"
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      filterOptions={filterOptions}
      data={submissions}
      loading={loading}
      modals={modals}
      pagination={pagination}
      columns={submissionColumns}
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
