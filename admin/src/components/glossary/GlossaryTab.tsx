import {
  useGlossaryQuery,
  useBulkDeleteGlossaryMutation,
  useBulkUpdateGlossaryMutation,
} from "@/hooks/queries/useGlossaryQueries";
import { useGlossaryFilters } from "@/hooks/filters/useGlossaryFilters";
import { useGlossary } from "@/contexts/GlossaryContext";
import { getGlossaryColumns } from "./GlossaryTableColumns";
import { DataTabSection } from "@/components/shared/DataTabSection";
import { useState } from "react";

export const GlossaryTab = () => {
  const { filters, updateFilters, resetFilters, filterOptions } =
    useGlossaryFilters();
  const { openModal, closeModal, modals, selectedTab, setGlossaryToView } =
    useGlossary();
  const bulkDeleteMutation = useBulkDeleteGlossaryMutation();
  const bulkUpdateMutation = useBulkUpdateGlossaryMutation();
  const [selectedRows] = useState<number[]>([]);

  const { data, isLoading } = useGlossaryQuery(filters);

  // @ts-ignore
  const glossaries = data?.data.terms || [];
  // @ts-ignore
  const pagination = data?.data.pagination;

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

  const columns = getGlossaryColumns({
    selectedTab,
    setEditDialogOpen: () => openModal("editGlossary"),
    setDeleteDialogOpen: () => openModal("deleteGlossary"),
    setGlossaryToView: (glossary) => {
      setGlossaryToView(glossary);
    },
    setGlossaryDetailsOpen: () => openModal("glossaryDetails"),
    deleteSelectedGlossary: handleBulkDelete,
    onApproveModeration: handleApproveModeration,
    onRejectModeration: handleRejectModeration,
    onApproveModerations: handleBulkApproveModerations,
  });

  return (
    <div className="space-y-4">
      <DataTabSection
        title="Glossary"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={resetFilters}
        filterOptions={filterOptions}
        data={glossaries}
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
        onCreate={() => openModal("createGlossary")}
        onImport={() => openModal("importGlossary")}
        onExport={() => openModal("exportGlossary")}
      />
    </div>
  );
};
