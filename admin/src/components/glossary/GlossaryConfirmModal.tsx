import DialogContainer from '../DialogContainer';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface GlossaryConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossaryTerm?: string;
  glossaryCategory?: string;
  onConfirm?: () => void;
  loading?: boolean;
}

const GlossaryConfirmModal = ({ 
  open, 
  onOpenChange, 
  glossaryTerm, 
  glossaryCategory, 
  onConfirm,
  loading = false 
}: GlossaryConfirmModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <DialogContainer
      title={"Glossary"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="md"
    >
      <div className="flex flex-col gap-6">
        <div className="text-lg font-medium">
          {loading ? 'Publishing glossary item...' : 'Glossary item has been published'}
        </div>
        <div className="bg-[#F7F7F7] rounded-lg p-3 flex items-center gap-2">
          <div className="bg-[#FFFFFF] w-full rounded-lg p-3 ">
            <div className='flex items-center gap-2 mb-1'>
              <span className="font-medium">{glossaryTerm}</span>
            </div>
            <p className="text-xs text-[#FF5A5A] font-semibold border border-[#F2F2F2] px-1.5 py-0 rounded w-fit">
              {glossaryCategory}
            </p>
          </div>
        </div>
        <button
          className="bg-black w-full text-white rounded-lg px-6 py-2 mt-4 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading && <LoadingSpinner />}
          {loading ? 'Publishing...' : 'Okay'}
        </button>
      </div>
    </DialogContainer>
  );
};

export default GlossaryConfirmModal; 