import { useGlossary } from '@/contexts/GlossaryContext';
import { CreateGlossaryDialog } from './CreateGlossaryDialog';
import DeleteGlossaryDialog from './DeleteGlossaryDialog';
import ViewGlossaryDialog from './ViewGlossaryDialog';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { EditGlossaryDialog } from './EditGlossaryDialog';
import { ImportGlossaryDialog } from './ImportGlossary';
import { ExportGlossaryDialog } from './ExportGlossary';

export const GlossaryDialogs = () => {
  const { modals, closeModal, glossaryToView, openModal } = useGlossary();
  const { data: categoriesData } = useCategoriesQuery({ section: 'Glossary', limit: 100 });
  const { data: tagsData } = useTagsQuery();

  return (
    <>
      <CreateGlossaryDialog
        open={modals.createGlossary}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('createGlossary');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <EditGlossaryDialog
        glossary={glossaryToView}
        open={modals.editGlossary}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('editGlossary');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <DeleteGlossaryDialog
        open={modals.deleteGlossary}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('deleteGlossary');
        }}
        glossary={glossaryToView}
        onConfirm={() => {
          closeModal('deleteGlossary');
        }}
      />
      <ViewGlossaryDialog
        open={modals.glossaryDetails}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('glossaryDetails');
        }}
        glossary={glossaryToView}
        openEditModal={() => openModal('editGlossary')}
      />
      <ImportGlossaryDialog
        open={modals.importGlossary}
        onOpenChange={() => closeModal('importGlossary')}
      />

      <ExportGlossaryDialog
        open={modals.exportGlossary}
        onOpenChange={() => closeModal('exportGlossary')}
      />
    </>
  );
}; 