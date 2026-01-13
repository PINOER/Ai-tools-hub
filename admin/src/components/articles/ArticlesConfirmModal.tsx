import DialogContainer from '../DialogContainer';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ArticleConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleTerm?: string;
  articleCategory?: string;
  onConfirm?: () => void;
  loading?: boolean;
}

const ArticleConfirmModal = ({ 
  open, 
  onOpenChange, 
  articleTerm, 
  articleCategory, 
  onConfirm,
  loading = false 
}: ArticleConfirmModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <DialogContainer
      title={"Article"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="md"
    >
      <div className="flex flex-col gap-6">
        <div className="text-lg font-medium">
          {loading ? 'Publishing article item...' : 'article item has been published'}
        </div>
        <div className="bg-[#F7F7F7] rounded-lg p-3 flex items-center gap-2">
          <div className="bg-[#FFFFFF] w-full rounded-lg p-3 ">
            <div className='flex items-center gap-2 mb-1'>
              <span className="font-medium">{articleTerm}</span>
            </div>
            <p className="text-xs text-[#FF5A5A] font-semibold border border-[#F2F2F2] px-1.5 py-0 rounded w-fit">
              {articleCategory}
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

export default ArticleConfirmModal; 