import type { Learning } from '@/types/learning';
import { CreateLearningDialog } from './CreateLearningDialog';

interface EditLearningDialogProps {
  learning: Learning | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  tags: any[];
}

export const EditLearningDialog = ({
  learning,
  open,
  onOpenChange,
  categories,
  tags,
}: EditLearningDialogProps) => {
  if (!learning) return null;

  return (
    <CreateLearningDialog
      open={open}
      onOpenChange={onOpenChange}
      categories={categories}
      tags={tags}
      learning={learning}
    />
  );
}; 
