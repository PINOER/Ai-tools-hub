import { GenericImportDialog } from '@/components/shared/GenericImportDialog';

interface ImportPromptsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportPromptsDialog = ({ open, onOpenChange }: ImportPromptsProps) => {
  return (
    <GenericImportDialog
      open={open}
      onOpenChange={onOpenChange}
      entityType="Prompt"
      title="Import prompts"
    />
  );
};
