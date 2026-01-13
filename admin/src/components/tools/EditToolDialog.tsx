import type { Tools, ToolSubmission } from '@/types/tools';
import { CreateToolDialog } from './CreateToolDialog';

interface EditToolDialogProps {
  tool: Tools | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSubmissions?: React.Dispatch<React.SetStateAction<ToolSubmission[]>>;
  categories: any[];
  tags: any[];
}

export const EditToolDialog = ({
  tool,
  open,
  onOpenChange,
  setSubmissions,
  categories,
  tags,
}: EditToolDialogProps) => {
  if (!tool) return null;

  return (
    <CreateToolDialog
      open={open}
      onOpenChange={onOpenChange}
      categories={categories}
      tags={tags}
      tool={tool}
      setSubmissions={setSubmissions}
    />
  );
};
