import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportLearningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportLearningDialog = ({ open, onOpenChange }: ExportLearningProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Learning"
      title="Export learning"
    />
  );
};
