import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportToolsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportToolDialog = ({ open, onOpenChange }: ImportToolsProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Tool"
      title="Import tools"
    />
  );
};
