import { useNews } from '@/contexts/NewsContext';
import { CreateNewsDialog } from './CreateNewsDialog';
import { DeleteNewsDialog } from './DeleteNewsDialog';
import { NewsDetailsDialog } from './NewsDetailDialog';
import { EditNewsDialog } from './EditNewsDialog';
import { ImportNewsDialog } from './ImportNews';
import { ExportNewsDialog } from './ExportNews';
import { PublishConfirmationDialog } from './PublishConfirmationDialog';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { useDeleteNewsMutation } from '@/hooks/queries/useNewsQueries';

export const NewsDialogs = () => {
  const { modals, closeModal, newsToView, openModal, createdNews } = useNews();
  const { data: categoriesData } = useCategoriesQuery({ section: 'News', limit: 100 });
  const { data: tagsData } = useTagsQuery();
  const deleteNewsMutation = useDeleteNewsMutation();

  const handleDeleteNews = async (id: number) => {
    try {
      await deleteNewsMutation.mutateAsync(id);
      // Close the delete modal
      closeModal('deleteNews');
      // If we're viewing the news that was just deleted, close the details modal too
      if (newsToView?.id === id) {
        closeModal('newsDetails');
        closeModal('editNews');
      }
    } catch (error) {
      // Error handling is already done in the mutation hook
      console.error('Error deleting news:', error);
    }
  };

  return (
    <>
      <CreateNewsDialog
        open={modals.createNews}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('createNews');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
        setNews={(news: any) => {
          // TODO: Implement setNews functionality
          console.log('Set news:', news);
        }}
        openConfirmationDialog={(open: boolean) => {
          if (open) {
            openModal('publishConfirmation');
          }
        }}
        setCreatedNews={(news: any) => {
          // TODO: Implement setCreatedNews functionality
          console.log('Set created news:', news);
        }}
      />
      <EditNewsDialog
        news={newsToView}
        open={modals.editNews}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('editNews');
          }
        }}
      />
      <DeleteNewsDialog
        open={modals.deleteNews}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('deleteNews');
        }}
        news={newsToView}
        deleteNews={handleDeleteNews}
      />
      <NewsDetailsDialog
        news={newsToView}
        open={modals.newsDetails}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('newsDetails');
        }}
        onDelete={handleDeleteNews}
        setEditDialogOpen={(open: boolean) => {
          if (open) {
            openModal('editNews');
          }
        }}
      />
      <ImportNewsDialog
        open={modals.importNews}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('importNews');
        }}
      />

      <ExportNewsDialog
        open={modals.exportNews}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('exportNews');
        }}
      />

      <PublishConfirmationDialog
        open={modals.publishConfirmation}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('publishConfirmation');
        }}
        news={createdNews}
      />
    </>
  );
}; 