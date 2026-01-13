import { CreateLearningDialog } from './CreateLearningDialog';
import DeleteLearningDialog from './DeleteLearningDialog';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { EditLearningDialog } from './EditLearningDialog';
import { useLearning } from '@/contexts/LearningContext';
import ViewLearningDialog from './ViewLearningDialog';
import { ImportLearningDialog } from './ImportLearning';
import { ExportLearningDialog } from './ExportLearning';

export const LearningDialogs = () => {
  const { modals, closeModal, learningToView, openModal } = useLearning();
  const { data: categoriesData } = useCategoriesQuery({ section: 'Learning', limit: 100 });
  const { data: tagsData } = useTagsQuery();

  return (
    <>
      <CreateLearningDialog
        open={modals.createLearning}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('createLearning');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <EditLearningDialog
        learning={learningToView}
        open={modals.editLearning}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('editLearning');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <DeleteLearningDialog
        open={modals.deleteLearning}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('deleteLearning');
        }}
        learning={learningToView}
        onConfirm={() => {
          closeModal('deleteLearning');
        }}
      />
      <ViewLearningDialog
        open={modals.learningDetails}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('learningDetails');
        }}
        learning={learningToView}
        openEditModal={() => openModal('editLearning')}
      />
      <ImportLearningDialog
        open={modals.importLearning}
        onOpenChange={() => closeModal('importLearning')}
      />

      <ExportLearningDialog
        open={modals.exportLearning}
        onOpenChange={() => closeModal('exportLearning')}
      />
    </>
  );
}; 