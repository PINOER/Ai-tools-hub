import { usePrompts } from '@/contexts/PromptsContext';
import { CreatePromptDialog } from './CreatePromptDialog';
import { EditPromptDialog } from './EditPromptDialog';
import DeletePromptDialog from './DeletePromptDialog';
import ViewPromptDialog from './ViewPromptDialog';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { ImportPromptsDialog } from './ImportPrompts';
import { ExportPromptsDialog } from './ExportPrompts';

export const PromptsDialogs = () => {
  const { modals, closeModal, promptToView, openModal } = usePrompts();
  const { data: categoriesData } = useCategoriesQuery({ section: 'Prompt', limit: 100 });
  const { data: tagsData } = useTagsQuery();

  return (
    <>
      <CreatePromptDialog
        open={modals.createPrompt}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('createPrompt');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <EditPromptDialog
        prompt={promptToView}
        open={modals.editPrompt}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('editPrompt');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <DeletePromptDialog
        open={modals.deletePrompt}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('deletePrompt');
        }}
        prompt={promptToView}
        onConfirm={() => {
          closeModal('deletePrompt');
        }}
      />
      <ViewPromptDialog
        open={modals.promptDetails}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('promptDetails');
        }}
        prompt={promptToView}
        openEditModal={() => openModal('editPrompt')}
      />
      <ImportPromptsDialog
        open={modals.importPrompt}
        onOpenChange={() => closeModal('importPrompt')}
      />

      <ExportPromptsDialog
        open={modals.exportPrompt}
        onOpenChange={() => closeModal('exportPrompt')}
      />
    </>
  );
}; 