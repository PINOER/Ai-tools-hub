import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportGlossaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportGlossaryDialog = ({ open, onOpenChange }: ImportGlossaryProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Glossary"
      title="Import glossary"
    />
  );
};
