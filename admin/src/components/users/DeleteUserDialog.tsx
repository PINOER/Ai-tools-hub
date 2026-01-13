import { useState } from 'react';
import DialogContainer from '@/components/DialogContainer';
import Card from '@/components/Card';
import type { User } from '@/types/user';
import { useUser } from '@/hooks/useUser';

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteUser: (id: number) => Promise<void>;
}

const REASONS_FOR_DELETION = [
  'Policy Violation',
  'Spam Content',
  'Owner Request',
  'Duplicate Entry',
  'Broken/Non-functional',
  'Other',
];

export const DeleteUserDialog = ({
  user,
  open,
  onOpenChange,
  deleteUser,
}: DeleteUserDialogProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userId } = useUser();
  
  // Check if user is trying to delete themselves
  const isDeletingSelf = user?.id === userId;

  const toggleReasons = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((p) => p !== reason)
        : [...prev, reason]
    );
  };

  if (!user) return null;

  return (
    <DialogContainer
      title='Remove User'
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='xl'
    >
      <div className='flex flex-col gap-8 p-6'>
        <svg
          width='36'
          height='40'
          viewBox='0 0 36 40'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='mt-4'
        >
          <path
            d='M12.6329 33.992C12.2556 33.992 11.9513 33.8916 11.7201 33.6907C11.4888 33.4781 11.3671 33.1945 11.355 32.8401L10.8073 14.2667C10.7951 13.9241 10.9047 13.6464 11.1359 13.4338C11.3671 13.2093 11.6714 13.097 12.0487 13.097C12.426 13.097 12.7302 13.2034 12.9615 13.416C13.1927 13.6287 13.3083 13.9064 13.3083 14.249L13.8742 32.8223C13.8742 33.1768 13.7586 33.4603 13.5274 33.673C13.3083 33.8857 13.0101 33.992 12.6329 33.992ZM18 33.992C17.6227 33.992 17.3124 33.8857 17.069 33.673C16.8377 33.4603 16.7221 33.1827 16.7221 32.8401V14.2667C16.7221 13.9241 16.8377 13.6464 17.069 13.4338C17.3124 13.2093 17.6227 13.097 18 13.097C18.3895 13.097 18.6998 13.2093 18.931 13.4338C19.1744 13.6464 19.2961 13.9241 19.2961 14.2667V32.8401C19.2961 33.1827 19.1744 33.4603 18.931 33.673C18.6998 33.8857 18.3895 33.992 18 33.992ZM23.3854 33.992C22.9959 33.992 22.6856 33.8857 22.4544 33.673C22.2353 33.4603 22.1318 33.1768 22.144 32.8223L22.6917 14.2667C22.7039 13.9123 22.8256 13.6287 23.0568 13.416C23.288 13.2034 23.5862 13.097 23.9513 13.097C24.3408 13.097 24.645 13.2093 24.8641 13.4338C25.0953 13.6464 25.2049 13.9241 25.1927 14.2667L24.645 32.8401C24.6329 33.1945 24.5112 33.4781 24.2799 33.6907C24.0487 33.8916 23.7505 33.992 23.3854 33.992ZM9.71197 8.15241V4.32432C9.71197 2.96559 10.1318 1.90814 10.9716 1.15197C11.8235 0.383991 13.0041 0 14.5132 0H21.4503C22.9594 0 24.14 0.383991 24.9919 1.15197C25.8438 1.90814 26.2698 2.96559 26.2698 4.32432V8.15241H22.8925V4.48383C22.8925 4.03485 22.7404 3.67449 22.4361 3.40275C22.1318 3.11918 21.7241 2.9774 21.213 2.9774H14.7505C14.2515 2.9774 13.8499 3.11918 13.5456 3.40275C13.2414 3.67449 13.0892 4.03485 13.0892 4.48383V8.15241H9.71197ZM1.62475 10.1019C1.17444 10.1019 0.791075 9.94831 0.474645 9.64112C0.158215 9.33392 0 8.96175 0 8.52459C0 8.09925 0.158215 7.73889 0.474645 7.44351C0.791075 7.13632 1.17444 6.98272 1.62475 6.98272H34.3935C34.8438 6.98272 35.2211 7.13041 35.5254 7.42579C35.8418 7.72116 36 8.08743 36 8.52459C36 8.96175 35.8418 9.33392 35.5254 9.64112C35.2211 9.94831 34.8438 10.1019 34.3935 10.1019H1.62475ZM9.62069 40C8.20893 40 7.07708 39.616 6.22515 38.848C5.3854 38.08 4.93509 37.0108 4.87424 35.6402L3.59635 9.76517H6.93712L8.19675 35.0908C8.2211 35.6107 8.39757 36.036 8.72617 36.3669C9.05477 36.6977 9.47465 36.8631 9.9858 36.8631H26.0142C26.5254 36.8631 26.9452 36.6977 27.2738 36.3669C27.6024 36.0479 27.7789 35.6225 27.8032 35.0908L29.0081 9.76517H32.4037L31.144 35.6225C31.0832 36.9931 30.6268 38.0623 29.7748 38.8303C28.9229 39.6101 27.7972 40 26.3976 40H9.62069Z'
            fill='black'
          />
        </svg>
        <div className='flex flex-col gap-2'>
          <p className='text-black'>You are about to remove User?</p>
          <p className='text-[#00000080]'>
            This will permanently delete this User and all related data.
          </p>
          {isDeletingSelf && (
            <p className='text-red-500 text-sm font-medium'>
              ⚠️ You cannot delete your own account.
            </p>
          )}
        </div>

        <Card className='flex-row gap-4'>
          <img src='/icons/logo.svg' alt='User Image' width={80} height={80} />
          <div className='flex flex-col'>
            <p>{user.name}</p>
            <p className='text-[#808080]'>{user?.role?.role}</p>
            {/* <div className='flex items-center gap-2'>
              {user?.User_tags?.map(({ tag }: { tag: any }) => (
                <p className='text-[#007AFF] bg-white px-3 py-1 rounded-md'>
                  {tag.name}
                </p>
              ))}
            </div> */}
          </div>
        </Card>

        <div className='flex flex-col gap-2'>
          <p className='text-[#808080]'>Reason for Deletion (optional)</p>

          <div className='flex flex-col gap-2 w-fit'>
            {REASONS_FOR_DELETION.map((reason, index) => (
              <p
                key={index}
                className={`${
                  selectedReasons.includes(reason)
                    ? 'bg-[#4D4D4D] text-white'
                    : 'bg-white text-black'
                } px-2 cursor-pointer border border-[#F2F2F2] rounded-lg`}
                onClick={() => toggleReasons(reason)}
              >
                {reason}
              </p>
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex items-center gap-3'>
          <div
            className='w-3/6 text-center border border-[#F2F2F2] rounded-md py-1 cursor-pointer'
            onClick={() => onOpenChange(false)}
            style={{ pointerEvents: isDeleting ? 'none' : 'auto' }}
          >
            Cancel
          </div>
          <button
            type='submit'
            className={`w-3/6 text-center rounded-md py-1 ${
              isDeletingSelf 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-black text-white cursor-pointer'
            }`}
            disabled={isDeleting || isDeletingSelf}
            onClick={async () => {
              if (isDeletingSelf) return;
              
              try {
                setIsDeleting(true);
                await deleteUser(user.id);
                // Modal will be closed by the deleteUser function on success
              } catch {
                // Error is handled by deleteUser function
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            {isDeleting ? 'Deleting...' : isDeletingSelf ? 'Cannot Delete Self' : 'Confirm'}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};
