import type { Glossary } from '@/types/glossary';
import { CreateGlossaryDialog } from './CreateGlossaryDialog';

interface EditGlossaryDialogProps {
  glossary: Glossary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  tags: any[];
}

export const EditGlossaryDialog = ({
  glossary,
  open,
  onOpenChange,
  categories,
  tags,
}: EditGlossaryDialogProps) => {
  if (!glossary) return null;

  return (
    <CreateGlossaryDialog
      open={open}
      onOpenChange={onOpenChange}
      categories={categories}
      tags={tags}
      glossary={glossary}
    />
  );
}; 