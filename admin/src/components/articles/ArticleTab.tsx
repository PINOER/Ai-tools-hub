import { DataTabSection } from "@/components/shared/DataTabSection";
import { useArticle } from "@/contexts/ArticleContext";
import { useArticleFilters } from "@/hooks/filters/useArticlesFilters";
import { useArticleQuery, useBulkDeleteArticleMutation, useBulkUpdateArticleMutation } from "@/hooks/queries/useArticlesQueries";
import { useState } from "react";
import { getArticleColumns } from "./ArticlesTableColumns";

export const ArticleTab = () => {
  const { filters, updateFilters, resetFilters, filterOptions } =
    useArticleFilters();
  const { openModal, closeModal, modals, selectedTab, setArticleToView } =
    useArticle();
  const bulkDeleteMutation = useBulkDeleteArticleMutation();
  const bulkUpdateMutation = useBulkUpdateArticleMutation();
  const [selectedRows] = useState<number[]>([]);

  const { data, isLoading } = useArticleQuery(filters);
  // @ts-ignore
  const articles = data?.articles || [];
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

  const columns = getArticleColumns({
    selectedTab,
    setEditDialogOpen: () => openModal("editArticle"),
    setDeleteDialogOpen: () => openModal("deleteArticle"),
    setArticleToView: (article) => {
      setArticleToView(article);
    },
    setArticleDetailsOpen: () => openModal("articleDetails"),
    deleteSelectedArticle: handleBulkDelete,
    onApproveModeration: handleApproveModeration,
    onRejectModeration: handleRejectModeration,
    onApproveModerations: handleBulkApproveModerations,
  });

  return (
    <div className="space-y-4">
      <DataTabSection
        title="Article"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={resetFilters}
        filterOptions={filterOptions}
        data={articles}
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
        onCreate={() => openModal("createArticle")}
        onImport={() => openModal("importArticle")}
        onExport={() => openModal("exportArticle")}
      />
    </div>
  );
};