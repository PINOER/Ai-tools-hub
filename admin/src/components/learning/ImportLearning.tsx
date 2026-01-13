import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportLearningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportLearningDialog = ({ open, onOpenChange }: ImportLearningProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Learning"
      title="Import learning"
    />
  );
};