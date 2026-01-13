import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportArticleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportArticleDialog = ({ open, onOpenChange }: ImportArticleProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Article"
      title="Import article"
    />
  );
};