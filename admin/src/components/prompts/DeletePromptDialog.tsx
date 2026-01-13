import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import { useDeletePromptMutation } from '@/hooks/queries/usePromptsQueries';
import type { Prompt } from '@/types/prompt';
import Delete from "../icons/Delete.svg";

const REASONS = [
  'Policy Violation',
  'Spam Content',
  'Owner Request',
  'Duplicate Entry',
  'Broken/Non-functional',
];

interface DeletePromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onConfirm: (id: string) => void;
}

const DeletePromptDialog = ({ open, onOpenChange, prompt, onConfirm }: DeletePromptDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const deleteMutation = useDeletePromptMutation();

  if (!prompt) return null;

  const handleConfirm = () => {
    deleteMutation.mutate(Number(prompt.id), {
      onSuccess: () => {
        onConfirm(String(prompt?.id || ''));
        onOpenChange(false);
      }
    });
  };

  return (
    <DialogContainer
      title="Remove Prompt item"
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 p-3">
        <div className="flex flex-col gap-3 mb-3 mt-5">
          <img src={Delete} alt="Options Icon" width={30}/>
          <div>
            <div className="font-medium text-lg">You are about to remove prompt item?</div>
            <div className="text-[#00000080] text-md">This will permanently delete this tool and all related data.</div>
          </div>
        </div>
        <div className="bg-[#F7F7F7] rounded-lg p-3 flex items-center gap-2 mb-3">
          <div className="bg-[#FFFFFF] w-full rounded-lg p-3 ">
            <div className='flex items-center gap-2'>
              <span className="text-lg">🔍</span>
              <span className="font-medium">{prompt.title}</span>
            </div>
            <p className="text-xs text-[#34B1C8] border border-[#F2F2F2] px-2 py-1 rounded w-fit">
              {prompt.promptCategories?.[0]?.category?.name || 'No category'}
            </p>
          </div>
          
        </div>
        <div>
          <div className="text-xs text-[#888] mb-2">REASON FOR DELETION (OPTIONAL)</div>
          <div className="flex flex-col justify-start items-start gap-2">
            {REASONS.map(reason => (
              <button
                key={reason}
                className={`px-3 py-1 rounded-lg cursor-pointer text-xs font-medium ${selectedReason === reason ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
                onClick={() => setSelectedReason(reason)}
                type="button"
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="flex-1 border rounded-lg py-2 cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-black text-white rounded-lg py-2 cursor-pointer"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};

export default DeletePromptDialog; 