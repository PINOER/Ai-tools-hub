import { usePromptsQuery, useBulkDeletePromptsMutation, useBulkUpdatePromptsMutation } from '@/hooks/queries/usePromptsQueries';
import { usePromptsFilters } from '@/hooks/filters/usePromptsFilters';
import { usePrompts } from '@/contexts/PromptsContext';
import { getPromptsColumns } from './PromptsTableColumns';
import { DataTabSection } from '@/components/shared/DataTabSection';
import { useState } from 'react';

export const PromptsTab = () => {
  const { filters, updateFilters, filterOptions } = usePromptsFilters();
  const { openModal, selectedTab, setPromptToView, modals, closeModal } = usePrompts();
  const bulkDeleteMutation = useBulkDeletePromptsMutation();
  const bulkUpdateMutation = useBulkUpdatePromptsMutation();
  const [selectedRows] = useState<number[]>([]);
  
  const { data, isLoading } = usePromptsQuery(filters);
  
  const prompts = data?.data || [];
  const pagination = data?.pagination;

  const handleBulkDelete = (selectedRows: number[]) => {
    bulkDeleteMutation.mutate(selectedRows);
  };

  const handleApproveModeration = (id: number) => {
    bulkUpdateMutation.mutate({
      ids: [id],
      data: { moderation_status: 'Approved' }
    });
  };

  const handleRejectModeration = (id: number) => {
    bulkUpdateMutation.mutate({
      ids: [id],
      data: { moderation_status: 'Rejected' }
    });
  };

  const handleBulkApproveModerations = (selectedIds?: number[]) => {
    const idsToUpdate = selectedIds || selectedRows;
    if (idsToUpdate.length > 0) {
      bulkUpdateMutation.mutate({
        ids: idsToUpdate,
        data: { moderation_status: 'Approved' }
      });
    }
  };

  const columns = getPromptsColumns({
    selectedTab,
    setEditDialogOpen: () => openModal('editPrompt'),
    setDeleteDialogOpen: () => openModal('deletePrompt'),
    setPromptToView,
    setPromptDetailsOpen: () => openModal('promptDetails'),
    deleteSelectedPrompts: handleBulkDelete,
    onApproveModeration: handleApproveModeration,
    onRejectModeration: handleRejectModeration,
    onApproveModerations: handleBulkApproveModerations,
  });

  return (
    <div className="space-y-4">
      <DataTabSection
        title="Prompts"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={() => updateFilters({})}
        filterOptions={filterOptions}
        data={prompts}
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
        onCreate={() => openModal('createPrompt')}
        onImport={() => openModal('importPrompt')}
        onExport={() => openModal('exportPrompt')}
      />
    </div>
  );
}; 