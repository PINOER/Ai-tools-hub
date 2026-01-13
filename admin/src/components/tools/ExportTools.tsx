import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportToolsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportToolsDialog = ({ open, onOpenChange }: ExportToolsProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Tool"
      title="Export tools"
    />
  );
};
