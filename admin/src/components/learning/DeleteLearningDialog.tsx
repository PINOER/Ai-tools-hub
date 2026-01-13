import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import type { Learning } from '@/types/learning';
import Delete from "../icons/Delete.svg";
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useDeleteLearningMutation } from '@/hooks/queries/useLearningQueries';

const REASONS = [
  'Policy Violation',
  'Spam Content',
  'Owner Request',
  'Duplicate Entry',
  'Broken/Non-functional',
];

interface DeleteLearningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learning: Learning | null;
  onConfirm: (id: number) => void;
}

const DeleteLearningDialog = ({ open, onOpenChange, learning, onConfirm }: DeleteLearningDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const deleteLearningMutation = useDeleteLearningMutation();

  if (!learning) return null;

  const handleConfirm = async () => {
    try {
      await deleteLearningMutation.mutateAsync(learning.id);
      onConfirm(learning.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete learning:', error);
    }
  };

  return (
    <DialogContainer
      title="Remove learning item"
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-3 mb-3 mt-5">
          <img src={Delete} alt="Options Icon" width={30}/>
          <div>
            <div className="font-medium text-lg">You are about to remove learning item?</div>
            <div className="text-[#00000080] text-md">This will permanently delete this tool and all related data.</div>
          </div>
        </div>
        <div className="bg-[#F7F7F7] rounded-lg p-3 flex items-center gap-2 mb-3">
          <div className="bg-[#FFFFFF] w-full rounded-lg p-3 ">
            <div className='flex items-center gap-2'>
              <span className="text-lg">📖</span>
              <span className="font-medium">{learning.title}</span>
            </div>
            <p className="text-xs text-[#FF5A5A] border border-[#F2F2F2] px-1 py-0 font-semibold rounded w-fit">
            {learning.learningCategories?.[0]?.category?.name || 'No category'}
            </p>
          </div>
        </div>
        <div>
          <div className="text-xs text-[#888] mb-2">REASON FOR DELETION (OPTIONAL)</div>
          <div className="flex flex-col justify-start items-start gap-2">
            {REASONS.map(reason => (
              <button
                key={reason}
                className={`px-3 py-1 rounded-lg cursor-pointer text-xs ${selectedReason === reason ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
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
            disabled={deleteLearningMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-black text-white rounded-lg py-2 cursor-pointer flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={deleteLearningMutation.isPending}
          >
            {deleteLearningMutation.isPending && <LoadingSpinner />}
            {deleteLearningMutation.isPending ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};

export default DeleteLearningDialog; 