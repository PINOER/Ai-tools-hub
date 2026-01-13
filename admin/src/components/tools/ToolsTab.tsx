import React, { useCallback } from "react";
import { useTools } from "@/contexts/ToolsContext";
import { useToolsFilters } from "@/hooks/filters/useToolsFilters";
import { useToolsQuery } from "@/hooks/queries/useToolsQuery";
import { getToolsColumns } from './ToolsTableColumns';
import { 

  useDeleteMultipleToolsMutation
} from '@/hooks/queries/useToolsQuery';
import { QueryErrorHandler } from '@/components/shared/QueryErrorHandler';
import { DataTabSection } from '@/components/shared/DataTabSection';

export const ToolsTab: React.FC = () => {
  const { 
    selectedTab: currentTab,
    openModal, 
    closeModal, 
    modals,
    setToolToView
  } = useTools();

  const { filters, updateFilters, clearFilters, filterOptions } = useToolsFilters();

  const {
    data: toolsData,
    isLoading: loading,
    error: toolsError,
    refetch: refetchTools,
  } = useToolsQuery(filters);

  const tools = toolsData?.data.tools || [];
  const pagination = toolsData?.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };


  const deleteMultipleToolsMutation = useDeleteMultipleToolsMutation();

  const deleteSelectedTools = (ids: number[]) => deleteMultipleToolsMutation.mutate(ids);

  // Get columns using the new column functions
  const columns = getToolsColumns({
    selectedTab: currentTab,
    setEditDialogOpen: () => openModal('editTool'),
    setToolClaimDetailsDialogOpen: () => openModal('toolClaimDetails'),
    setDeleteDialogOpen: () => openModal('deleteTool'),
    setToolToView,
    setToolDetailsOpen: () => openModal('toolDetails'),
    deleteSelectedTools,
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

  // Show error state
  if (toolsError) {
    return (
      <QueryErrorHandler
        error={toolsError}
        refetch={refetchTools}
        title="Failed to load tools"
        message="Unable to fetch tools data. Please check your connection and try again."
      />
    );
  }

  return (
    <DataTabSection
      title="Tools"
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      filterOptions={filterOptions}
      data={tools}
      loading={loading}
      modals={modals}
      pagination={pagination}
      columns={columns}
      openModal={openModal}
      closeModal={closeModal}
      onCreate={handleCreate}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
};
