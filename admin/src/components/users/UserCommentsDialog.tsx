import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { User } from '@/types/user';

interface UserCommentsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserCommentsDialog = ({ user, open, onOpenChange }: UserCommentsDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Comments by {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {user.comments && user.comments.length > 0 ? (
            user.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{comment.title}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{comment.content}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>❤️ {comment.likes} likes</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments found for this user.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 