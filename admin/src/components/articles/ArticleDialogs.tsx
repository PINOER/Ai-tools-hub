import { useTagsQuery } from '@/hooks/queries/useTagsQuery';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { EditArticleDialog } from './EditArticleDialog';
import { CreateArticleDialog } from './CreateArticleDialog';
import { useArticle } from '@/contexts/ArticleContext';
import { DeletearticleDialog } from './DeleteArticleDialog';
import ViewArticleDialog from './ViewArticleDialog';
import { ImportArticleDialog } from './ImportArticle';
import { ExportArticlesDialog } from './ExportArticles';

export const ArticleDialogs = () => {
  const { modals, closeModal, articleToView, openModal } = useArticle();
  const { data: categoriesData } = useCategoriesQuery({ section: 'Article', limit: 100 });
  const { data: tagsData } = useTagsQuery();

  return (
    <>
      <CreateArticleDialog
        open={modals.createArticle}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('createArticle');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <EditArticleDialog
        article={articleToView}
        open={modals.editArticle}
        onOpenChange={(open: boolean) => {
          if (!open) {
            closeModal('editArticle');
          }
        }}
        categories={categoriesData?.categories || []}
        tags={tagsData?.tags || []}
      />
      <DeletearticleDialog
        open={modals.deleteArticle}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('deleteArticle');
        }}
        article={articleToView}
        onConfirm={() => {
          closeModal('deleteArticle');
        }}
      />
      <ViewArticleDialog
        open={modals.articleDetails}
        onOpenChange={(open: boolean) => {
          if (!open) closeModal('articleDetails');
        }}
        article={articleToView}
        openEditModal={() => openModal('editArticle')}
      />
      <ImportArticleDialog
        open={modals.importArticle}
        onOpenChange={() => closeModal('importArticle')}
      />

      <ExportArticlesDialog
        open={modals.exportArticle}
        onOpenChange={() => closeModal('exportArticle')}
      />
    </>
  );
}; 