import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportGlossaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportGlossaryDialog = ({ open, onOpenChange }: ExportGlossaryProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Glossary"
      title="Export glossary"
    />
  );
};
