import { DataTabSection } from "@/components/shared/DataTabSection";
import { useLearning } from "@/contexts/LearningContext";
import { useLearningFilters } from "@/hooks/filters/useLearningFilters";
import { useBulkDeleteLearningMutation, useBulkUpdateLearningMutation, useLearningQuery } from "@/hooks/queries/useLearningQueries";
import { useState } from "react";
import { getLearningColumns } from "./LearningTableColumns";

export const LearningTab = () => {
  const { filters, updateFilters, resetFilters, filterOptions } =
    useLearningFilters();
  const { openModal, closeModal, modals, selectedTab, setLearningToView } =
    useLearning();
  const bulkDeleteMutation = useBulkDeleteLearningMutation();
  const bulkUpdateMutation = useBulkUpdateLearningMutation();
  const [selectedRows] = useState<number[]>([]);

  const { data, isLoading } = useLearningQuery(filters);
  // @ts-ignore
  const learnings = data?.learnings || [];
  // @ts-ignore
  const paginationPage = data?.page;
  // @ts-ignore
  const paginationLimit = data?.limit;
  // @ts-ignore
  const paginationTotal = data?.total;
  // @ts-ignore
  const paginationTotalPages = data?.totalPages;

  const handleBulkDelete = (selectedRows: number[]) => {
    bulkDeleteMutation.mutate(selectedRows);
  };

  const handleApproveModeration = (id: number) => {
    bulkUpdateMutation.mutate({
      ids: [id],
      data: { moderation_status: "Approved" },
    });
  };

  const handleRejectModeration = (id: number) => {
    bulkUpdateMutation.mutate({
      ids: [id],
      data: { moderation_status: "Rejected" },
    });
  };

  const handleBulkApproveModerations = (selectedIds?: number[]) => {
    const idsToUpdate = selectedIds || selectedRows;
    if (idsToUpdate.length > 0) {
      bulkUpdateMutation.mutate({
        ids: idsToUpdate,
        data: { moderation_status: "Approved" },
      });
    }
  };

  const columns = getLearningColumns({
    selectedTab,
    setEditDialogOpen: () => openModal("editLearning"),
    setDeleteDialogOpen: () => openModal("deleteLearning"),
    setLearningToView: (learning) => {
      setLearningToView(learning);
    },
    setLearningDetailsOpen: () => openModal("learningDetails"),
    deleteSelectedLearning: handleBulkDelete,
    onApproveModeration: handleApproveModeration,
    onRejectModeration: handleRejectModeration,
    onApproveModerations: handleBulkApproveModerations,
  });

  return (
    <div className="space-y-4">
      <DataTabSection
        title="Learning"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={resetFilters}
        filterOptions={filterOptions}
        data={learnings}
        loading={isLoading}
        modals={modals}
        pagination={{
          page: paginationPage || 1,
          limit: paginationLimit || 10,
          total: paginationTotal || 0,
          totalPages: paginationTotalPages || 1,
        }}
        columns={columns}
        openModal={openModal}
        closeModal={closeModal}
        onCreate={() => openModal("createLearning")}
        onImport={() => openModal("importLearning")}
        onExport={() => openModal("exportLearning")}
      />
    </div>
  );
};