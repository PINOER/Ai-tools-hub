import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import type { Glossary } from '@/types/glossary';
import Delete from "../icons/Delete.svg";
import { useDeleteGlossaryMutation } from '@/hooks/queries/useGlossaryQueries';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const REASONS = [
  'Policy Violation',
  'Spam Content',
  'Owner Request',
  'Duplicate Entry',
  'Broken/Non-functional',
];

interface DeleteGlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossary: Glossary | null;
  onConfirm: (id: number) => void;
}

const DeleteGlossaryDialog = ({ open, onOpenChange, glossary, onConfirm }: DeleteGlossaryDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const deleteGlossaryMutation = useDeleteGlossaryMutation();

  if (!glossary) return null;

  const handleConfirm = async () => {
    try {
      await deleteGlossaryMutation.mutateAsync(glossary.id);
      onConfirm(glossary.id);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete glossary:', error);
    }
  };

  return (
    <DialogContainer
      title="Remove glossary item"
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-3 mb-3 mt-5">
          <img src={Delete} alt="Options Icon" width={30}/>
          <div>
            <div className="font-medium text-lg">You are about to remove glossary item?</div>
            <div className="text-[#00000080] text-md">This will permanently delete this tool and all related data.</div>
          </div>
        </div>
        <div className="bg-[#F7F7F7] rounded-lg p-3 flex items-center gap-2 mb-3">
          <div className="bg-[#FFFFFF] w-full rounded-lg p-3 ">
            <div className='flex items-center gap-2'>
              <span className="text-lg">📖</span>
              <span className="font-medium">{glossary.term}</span>
            </div>
            <p className="text-xs text-[#FF5A5A] border border-[#F2F2F2] px-1 py-0 font-semibold rounded w-fit">
            {glossary.glossary_categories?.[0]?.category?.name || 'No category'}
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
            disabled={deleteGlossaryMutation.isPending}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-black text-white rounded-lg py-2 cursor-pointer flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={deleteGlossaryMutation.isPending}
          >
            {deleteGlossaryMutation.isPending && <LoadingSpinner />}
            {deleteGlossaryMutation.isPending ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};

export default DeleteGlossaryDialog; 