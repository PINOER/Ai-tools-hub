import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubmissionsTab } from '@/components/tools/SubmissionsTab';
import { ToolsProvider } from '@/contexts/ToolsContext';
import type { User } from '@/types/user';

interface UserSubmissionsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserSubmissionsDialog = ({ user, open, onOpenChange }: UserSubmissionsDialogProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-10xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Tool Submitted
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <ToolsProvider>
            <SubmissionsTab 
              userId={user.id} 
              hideControls={true}
              showPagination={false}
              showFilters={false}
              showSearch={false}
            />
          </ToolsProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 