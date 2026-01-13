import { GenericExportDialog } from '@/components/shared/GenericExportDialog';

interface ExportPromptsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportPromptsDialog = ({ open, onOpenChange }: ExportPromptsProps) => {
  return (
    <GenericExportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Prompt"
      title="Export prompts"
    />
  );
};
