import React, { useCallback } from 'react';
import { useTools } from '@/contexts/ToolsContext';
import { useClaimsFilters } from '@/hooks/filters/useClaimsFilters';
import { getClaimsColumns } from './ToolsTableColumns';
import { 
  useClaimsQuery,
  useDeleteMultipleToolClaimsMutation,
  useDeleteToolClaimMutation,
  useUpdateMultipleToolClaimsStatusMutation,
} from '@/hooks/queries/useToolsQuery';
import { DataTabSection } from '@/components/shared/DataTabSection';
import { useUpdateToolClaimStatusMutation } from '../../hooks/queries/useToolsQuery';
import type { ToolsStatus } from '@/types/tools';

export const ClaimsTab: React.FC = () => {
  const { 
    selectedTab: currentTab,
    openModal,
    closeModal,
    modals,
    setToolToView
  } = useTools();
  
  const { filters, updateFilters, clearFilters, filterOptions } = useClaimsFilters();

  const {
    data: claimsData,
    isLoading: loading,
  } = useClaimsQuery(filters);

  const claims = claimsData?.data.claims || [];
  const pagination = claimsData?.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const updateMultipleClaims = useUpdateMultipleToolClaimsStatusMutation();
  const updateClaim = useUpdateToolClaimStatusMutation();
  const deleteMultipleClaims = useDeleteMultipleToolClaimsMutation();
  const deleteClaim = useDeleteToolClaimMutation();



  const updateClaims = (ids: number[], status: ToolsStatus) => updateMultipleClaims.mutate({ ids, status });
  const updateClaimStatus = (id: number, status: ToolsStatus) => updateClaim.mutate({ id, status });
  const deleteSelectedClaims = (ids: number[]) => deleteMultipleClaims.mutate(ids);
  const deleteSelectedClaim = (id: number) => deleteClaim.mutate(id);
 
 
 
  const claimsColumns = getClaimsColumns({
    selectedTab: currentTab,
    setToolClaimDetailsDialogOpen: () => openModal('toolClaimDetails'),
    setToolToView,
    deleteClaim: deleteSelectedClaim,
    updateClaims,
    updateClaimStatus,
    deleteClaims: deleteSelectedClaims
  });

  const handleCreate = useCallback(() => {
    openModal("createTool");
  }, [openModal]);

  const handleImport = useCallback(() => {
    openModal("importTool");
  }, [openModal]);

  const handleExport = useCallback(() => {
    openModal("importTool");
  }, [openModal]);

  return (
    <DataTabSection
      title="Claims"
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      filterOptions={filterOptions}
      data={claims}
      loading={loading}
      modals={modals}
      pagination={pagination}
      columns={claimsColumns}
      openModal={openModal}
      closeModal={closeModal}
      onCreate={handleCreate}
      onImport={handleImport}
      onExport={handleExport}
    />
  );
}; 