import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportNewsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportNewsDialog = ({ open, onOpenChange }: ImportNewsProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="News"
      title="Import news"
    />
  );
};