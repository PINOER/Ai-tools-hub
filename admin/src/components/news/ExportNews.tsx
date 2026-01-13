import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportNewsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportNewsDialog = ({ open, onOpenChange }: ExportNewsProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="News"
      title="Export news"
    />
  );
};
