import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToolsIcon, ReviewsIcon } from '../icons';
import { MessageSquare } from 'lucide-react';
import OptionsIcon from "@/components/icons/Options.svg";
import type { User } from '@/types/user';
import { EditUserDialog } from '@/components/users/EditUserDialog';
import { UserReviewsDialog } from './UserReviewsDialog';
import { UserSubmissionsDialog } from './UserSubmissionsDialog';
import { UserCommentsDialog } from './UserCommentsDialog';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/hooks/queries/useUsersQuery';
import { showSuccessToast, showErrorToast } from '@/lib/toast';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '../ui/input';
import SaveIcon from "@/components/icons/Save.svg";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ user, open, onOpenChange }: UserDetailsDialogProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [toolSubmissionsDialogOpen, setToolSubmissionsDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);

  const [moderationNotes, setModerationNotes] = useState(user?.moderation_notes || '');
  const [status, setStatus] = useState<"Active" | "Pending" | "Banned" | "Suspended" | "Inactive">(user?.status || "Active");
  const [role, setRole] = useState<'User' | 'Moderator' | 'Contributor' | 'Admin'>(user?.role?.role || "User");

  const mockActivityHistory = [
    { action: 'New article published', timestamp: '1d ago' },
    { action: 'Reviewed "ChatGPT"', timestamp: '1d ago' },
    { action: 'Saved "Claude" to favorites', timestamp: '1d ago' },
    { action: 'User registered', timestamp: '1d ago' },
  ];

  const { data: detailedUser } = useGetUserByIdQuery(user?.id || 0, open);

  const updateUserMutation = useUpdateUserMutation();

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          status,
          moderation_notes: moderationNotes,
          role
        }
      });
      showSuccessToast('User updated successfully!');
      onOpenChange(false);
    } catch (err: any) {
      console.error('Update user error:', err);
      const errorMsg = err?.data?.message || err?.message || 'Failed to update user. Please try again.';
      showErrorToast(errorMsg);
    }
  };

  const currentUser = detailedUser || user;

  if (!currentUser) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={false}>
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className='text-[27px] text-[#CCCCCC] font-normal'>User details</DialogTitle>
            <div className="flex gap-2 items-center justify-end">
            <img src={OptionsIcon} alt="Options Icon" />
            <button 
              className="bg-[#000000] rounded-lg px-3 py-1.5 text-xs flex items-center text-white gap-2"
              onClick={() => setEditDialogOpen(true)}
            >
              Edit{" "}
              <img src="/icons/edit.svg" alt="Edit" width={12} height={12} />
            </button>
            <button className="ml-2 -mt-1" onClick={() => onOpenChange(false)}>
              <span className="text-3xl font-normal text-[#e7e7e7] hover:cursor-pointer">&times;</span>
            </button>
          </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Info */}

            <div className='bg-[#F7F7F7] p-6'>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">AVATAR</p>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentUser?.avatar || ""} />
                  <AvatarFallback>{currentUser?.first_name && currentUser?.first_name[0]}{currentUser?.last_name && currentUser?.last_name[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">FIRST NAME</p>
                <p className="font-medium">{currentUser.first_name}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">LAST NAME</p>
                <p className="font-medium">{currentUser.last_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-[20px]">
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">USER ID</p>
                <p className="font-medium">{currentUser.id}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">USERNAME</p>
                <p className="font-medium">{currentUser.username}</p>
              </div>
              <div>
                <p className="text-[15px] text-[#CCCCCC] mb-1">EMAIL</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">ROLE</p>
                <Select 
                  value={role} 
                  onValueChange={(value: 'User' | 'Moderator' | 'Contributor' | 'Admin') => setRole(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Contributor">Contributor</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='w-full'>
                <Label className='text-sm text-gray-700 mb-1 block'>STATUS</Label>
                <Select value={status} onValueChange={v => setStatus(v as "Active" | "Pending" | "Banned" | "Suspended" | "Inactive") }>
                  <SelectTrigger className='w-full'>
                    <SelectValue>
                      {status && (
                        <span className={(() => {
                          switch (status) {
                            case 'Active':
                              return 'text-[#34C759]';
                            case 'Pending':
                              return 'text-[#FF9500]';
                            case 'Banned':
                              return 'text-[#FF3B30]';
                            case 'Suspended':
                              return 'text-[#FF9500]';
                            case 'Inactive':
                              return 'text-[#FF3B30]';
                            default:
                              return 'text-gray-700';
                          }
                        })()}>
                          {status}
                        </span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Active'><span className='text-[#34C759]'>Active</span></SelectItem>
                    <SelectItem value='Pending'><span className='text-[#FF9500]'>Pending</span></SelectItem>
                    <SelectItem value='Banned'><span className='text-[#FF3B30]'>Banned</span></SelectItem>
                    <SelectItem value='Suspended'><span className='text-[#FF9500]'>Suspended</span></SelectItem>
                    <SelectItem value='Inactive'><span className='text-[#FF3B30]'>Inactive</span></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contributions */}
            <div>
              <p className="text-sm text-gray-500 mb-3">CONTRIBUTIONS</p>
              <div className="grid grid-cols-3 gap-4">
                <div 
                  className="flex items-center gap-2 p-2 rounded border-2 rounded-[9px] border-[#F7F7F7] cursor-pointer hover:bg-gray-50"
                  onClick={() => setToolSubmissionsDialogOpen(true)}
                >
                  <ToolsIcon/>
                  <span className="text-[15px font-medium]">Tools submitted</span>
                  <span className="ml-auto font-medium">{currentUser._count?.toolSubmissions || 0}</span>
                </div>
                <div 
                  className="flex items-center gap-2 p-2 rounded border-2 rounded-[9px] border-[#F7F7F7] cursor-pointer hover:bg-gray-50"
                  onClick={() => setReviewsDialogOpen(true)}
                >
                  <ReviewsIcon/>
                  <span className="text-[15px font-medium]">Reviews</span>
                  <span className="ml-auto font-medium">{currentUser._count?.reviews || 0}</span>
                </div>
                <div 
                  className="flex items-center gap-2 p-2 rounded border-2 rounded-[9px] border-[#F7F7F7] cursor-pointer hover:bg-gray-50"
                  onClick={() => setCommentsDialogOpen(true)}
                >
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <span className="text-[15px font-medium]">Comments</span>
                  <span className="ml-auto font-medium">{currentUser._count?.comments || 0}</span>
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div>
              <p className="text-sm text-gray-500 mb-3">ACTIVITY HISTORY</p>
              <div className="space-y-2">
                {mockActivityHistory.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{activity.action}</span>
                    <span className="text-gray-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-3">Saved</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-2 rounded border-2 rounded-[9px] border-[#F7F7F7]">
                  <img src={SaveIcon} alt="Saved Icon" />
                  <span className="text-[15px font-medium]">Bookmarks</span>
                  <span className="ml-auto font-medium">{currentUser._count?.toolSubmissions || 0}</span>
                </div>
              </div>
            </div>

            {/* Moderation */}
            <div>
              <p className="text-sm text-gray-500 mb-3">MODERATION</p>
              <div>
                <p className="text-sm text-gray-700 mb-2">MODERATION NOTES</p>
                <Input
                  placeholder="Type"
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                />
              </div>
            </div>

            <Button className="w-full" onClick={handleSave} disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EditUserDialog
        user={user}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <UserReviewsDialog
        user={currentUser}
        open={reviewsDialogOpen}
        onOpenChange={setReviewsDialogOpen}
      />

      <UserSubmissionsDialog
        user={currentUser}
        open={toolSubmissionsDialogOpen}
        onOpenChange={setToolSubmissionsDialogOpen}
      />

      <UserCommentsDialog
        user={currentUser}
        open={commentsDialogOpen}
        onOpenChange={setCommentsDialogOpen}
      />

    </>
  );
};