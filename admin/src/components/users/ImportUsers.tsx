import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportUsersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportUsersDialog = ({ open, onOpenChange }: ImportUsersProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="User"
      title="Import users"
    />
  );
};