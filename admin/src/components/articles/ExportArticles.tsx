import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportArticlesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportArticlesDialog = ({ open, onOpenChange }: ExportArticlesProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Article"
      title="Export articles"
    />
  );
};
