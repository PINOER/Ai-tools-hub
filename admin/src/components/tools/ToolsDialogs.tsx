import React from 'react';
import { ToolDetailsDialog } from './ToolDetailDialog';
import { EditToolDialog } from './EditToolDialog';
import { ImportToolDialog } from './ImportTools';
import { ExportToolsDialog } from './ExportTools';
import { CreateToolDialog } from './CreateToolDialog';
import { DeleteToolDialog } from './DeleteToolDialog';
import { ToolClaimDetailsDialog } from './ToolClaimDetails';
import { ToolClaimApprovedDialog } from './ToolClaimApproved';
import { useTools } from '@/contexts/ToolsContext';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { 
  useDeleteToolMutation,
  useUpdateToolClaimStatusMutation,
} from '@/hooks/queries/useToolsQuery';
import { ToolsStatus } from '@/types/tools';

export const ToolsDialogs = React.memo(() => {
  const { 
    modals,
    closeModal,
    openModal,
    toolToView
  } = useTools();
  

  const { data: categoriesData } = useCategoriesQuery({ section: 'Tool' });
  const { data: tagsData } = useTagsQuery();

  // Extract the actual arrays from the API responses
  const categories = categoriesData?.categories || [];
  const tags = tagsData?.tags || [];



  const deleteToolMutation = useDeleteToolMutation();
  const approveClaimMutation = useUpdateToolClaimStatusMutation();

  const deleteTool = (id: number) => {
    deleteToolMutation.mutate(id);
  };

  const approveClaim = (id: number) => {
    approveClaimMutation.mutate({ id, status: ToolsStatus.Approved });
    openModal('toolClaimApproved');
  };

  return (
  <>
    <ToolDetailsDialog
      tool={toolToView}
      open={modals.toolDetails}
      onOpenChange={() => closeModal('toolDetails')}
      onDelete={deleteTool}
      setEditDialogOpen={() => {
        closeModal('toolDetails');
        openModal('editTool');
      }}
    />

    <EditToolDialog
      tool={toolToView}
      open={modals.editTool}
      onOpenChange={() => closeModal('editTool')}
      categories={categories}
      tags={tags}
    />

    <ImportToolDialog
      open={modals.importTool}
      onOpenChange={() => closeModal('importTool')}
    />

    <ExportToolsDialog
      open={modals.exportTool}
      onOpenChange={() => closeModal('exportTool')}
    />

    <CreateToolDialog
      open={modals.createTool}
      onOpenChange={() => closeModal('createTool')}
      categories={categories}
      tags={tags}
    />

    <DeleteToolDialog
      open={modals.deleteTool}
      onOpenChange={() => closeModal('deleteTool')}
      tool={toolToView}
      deleteTool={deleteTool}
    />

    <ToolClaimDetailsDialog
      open={modals.toolClaimDetails}
      onOpenChange={() => closeModal('toolClaimDetails')}
      tool={toolToView}
      approveClaim={approveClaim}
    />

    <ToolClaimApprovedDialog
      open={modals.toolClaimApproved}
      onOpenChange={() => closeModal('toolClaimApproved')}
      tool={toolToView}
    />
  </>
  );
}); 