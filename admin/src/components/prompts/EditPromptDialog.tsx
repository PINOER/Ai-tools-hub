import type { Prompt } from '@/types/prompt';
import { CreatePromptDialog } from './CreatePromptDialog';

interface EditPromptDialogProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  tags: any[];
}

export const EditPromptDialog = ({
  prompt,
  open,
  onOpenChange,
  categories,
  tags,
}: EditPromptDialogProps) => {
  if (!prompt) return null;

  return (
    <CreatePromptDialog
      open={open}
      onOpenChange={onOpenChange}
      categories={categories}
      tags={tags}
      prompt={prompt}
    />
  );
}; 