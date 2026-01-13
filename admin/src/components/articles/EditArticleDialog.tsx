import type { Article } from '@/types/article';
import { CreateArticleDialog } from './CreateArticleDialog';
interface EditArticleDialogProps {
  article: Article | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  tags: any[];
}

export const EditArticleDialog = ({
  article,
  open,
  onOpenChange,
  categories,
  tags,
}: EditArticleDialogProps) => {
  if (!article) return null;

  return (
    <CreateArticleDialog
      open={open}
      onOpenChange={onOpenChange}
      categories={categories}
      tags={tags}
      article={article}
    />
  );
}; 
