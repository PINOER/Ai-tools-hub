import { Star, ThumbsUp } from 'lucide-react';
import DialogContainer from '@/components/DialogContainer';
import { ReviewStatus, type Review } from '@/types/reviews';
import { ensureFloatWithOneDecimal, getReviewStatusColor } from '@/lib/utils';

interface ReviewDetailsDialogProps {
  review: Review | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  onFlag: (id: number) => Promise<void>;
}

export const ReviewDetailsDialog = ({
  review,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onFlag,
}: ReviewDetailsDialogProps) => {
  if (!review) return null;

  const isApproved = review.status === ReviewStatus.Approved;
  const isReported = review.status === ReviewStatus.Reported;
  const isFlagged = review.status === ReviewStatus.Flagged;

  return (
    <div>
      <DialogContainer
        title='User Review'
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div className='flex items-center gap-2 p-6'>
          <img src={review.user.avatar || ""} alt='user-avatar' />
          <p>{review.user.username}</p>
        </div>

        <div className='flex flex-col gap-3 pl-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <img src={review.tool.avatar || ""} alt='tool-avatar' />
              <p>{review?.tool?.name || "Tool name here"}</p>
            </div>
            <div className='flex items-center gap-2'>
              <p className='text-sm text-[#808080]'>{review.date || 'May 15, 2025'}</p>
              <p className={`rounded-lg px-2 py-1 text-sm text-black! ${getReviewStatusColor(review.status)}`}>{review.status}</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1'>
              <Star fill='black' width={20} height={20} />
              <Star fill='black' width={20} height={20} />
              <Star fill='black' width={20} height={20} />
              <Star fill='black' width={20} height={20} />
              <Star fill='black' width={20} height={20} />
            </div>
            <p>{ensureFloatWithOneDecimal(review.overall_rating)}</p>
          </div>

          <p className='text-[#4D4D4D]'>{review.comment}</p>

          <div className='flex items-center gap-1 pl-2 mt-1'>
            <ThumbsUp width={16} height={16} />
            <p className='text-[#808080] text-sm pt-0.5'>12</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex items-center gap-3 w-full justify-around'>
          <button
            className={`text-center border border-[#F2F2F2] rounded-md py-2 cursor-pointer px-8 font-semibold ${
              isReported 
                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'text-[#4D4D4D] hover:bg-gray-50'
            }`}
            onClick={async () => {
              if (!isReported) {
                await onReject(review.id);
                onOpenChange(false);
              }
            }}
            disabled={isReported}
          >
            Report review
          </button>
          <button
            className={`text-center border border-[#F2F2F2] rounded-md py-2 cursor-pointer px-8 font-semibold ${
              isFlagged 
                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                : 'text-[#4D4D4D] hover:bg-gray-50'
            }`}
            onClick={async () => {
              if (!isFlagged) {
                await onFlag(review.id);
                onOpenChange(false);
              }
            }}
            disabled={isFlagged}
          >
            Flag for Review
          </button>
          <button
            className={`text-center rounded-md py-2 cursor-pointer px-8 font-semibold ${
              isApproved 
                ? 'text-gray-400 cursor-not-allowed bg-gray-100 border border-gray-300' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            onClick={async () => {
              if (!isApproved) {
                await onApprove(review.id);
                onOpenChange(false);
              }
            }}
            disabled={isApproved}
          >
            Approve review
          </button>
        </div>
      </DialogContainer>
    </div>
  );
};
