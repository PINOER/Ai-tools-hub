import {
  useNewsQuery,
  useBulkDeleteNewsMutation,
  useBulkUpdateNewsMutation,
} from "@/hooks/queries/useNewsQueries";
import { useNewsFilters } from "@/hooks/filters/useNewsFilters";
import { useNews } from "@/contexts/NewsContext";
import { getNewsColumns } from "./NewsTableColumns";
import { DataTabSection } from "@/components/shared/DataTabSection";
import { useState } from "react";

export const NewsTab = () => {
  const { filters, updateFilters, resetFilters, filterOptions } =
    useNewsFilters();
  const { openModal, closeModal, modals, selectedTab, setNewsToView } =
    useNews();
  const bulkDeleteMutation = useBulkDeleteNewsMutation();
  const bulkUpdateMutation = useBulkUpdateNewsMutation();
  const [selectedRows] = useState<number[]>([]);

  const { data, isLoading } = useNewsQuery(filters);

  // @ts-ignore
  const news = data?.news || [];
  // @ts-ignore
  const pagination = data?.pagination;

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

  const columns = getNewsColumns({
    selectedTab,
    setEditDialogOpen: () => openModal("editNews"),
    setDeleteDialogOpen: () => openModal("deleteNews"),
    setNewsToView: (news) => {
      setNewsToView(news);
    },
    setNewsDetailsOpen: () => openModal("newsDetails"),
    deleteSelectedNews: handleBulkDelete,
    onApproveModeration: handleApproveModeration,
    onRejectModeration: handleRejectModeration,
    onApproveModerations: handleBulkApproveModerations,
  });

  return (
    <div className="space-y-4">
      <DataTabSection
        title="News"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={resetFilters}
        filterOptions={filterOptions}
        data={news}
        loading={isLoading}
        modals={modals}
        pagination={{
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: pagination?.total || 0,
          totalPages: pagination?.totalPages || 1,
        }}
        columns={columns}
        openModal={openModal}
        closeModal={closeModal}
        onCreate={() => openModal("createNews")}
        onImport={() => openModal("importNews")}
        onExport={() => openModal("exportNews")}
      />
    </div>
  );
}; 