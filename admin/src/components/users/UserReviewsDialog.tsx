import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ReviewsTab } from '@/components/reviews/ReviewsTab';
import type { User } from '@/types/user';

interface UserReviewsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserReviewsDialog = ({ user, open, onOpenChange }: UserReviewsDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-10xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
           Submitted Reviews
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <ReviewsTab 
            userId={user.id} 
            hideControls={true}
            showPagination={false}
            showFilters={false}
            showSearch={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 