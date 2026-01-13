import { useState } from 'react';
import DialogContainer from '@/components/DialogContainer';
import Card from '@/components/Card';
import type { User } from '@/types/user';
import { useUser } from '@/hooks/useUser';

interface UserActionDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'suspend' | 'ban';
  onAction: (id: number) => Promise<void>;
}

const REASONS_FOR_ACTION = [
  'Policy Violation',
  'Spam Content',
  'Inappropriate Behavior',
  'Security Concerns',
  'Terms of Service Violation',
  'Other',
];

export const UserActionDialog = ({
  user,
  open,
  onOpenChange,
  action,
  onAction,
}: UserActionDialogProps) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useUser();
  
  // Check if user is trying to action themselves
  const isActioningSelf = user?.id === userId;

  const toggleReasons = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((p) => p !== reason)
        : [...prev, reason]
    );
  };

  const getActionConfig = () => {
    switch (action) {
      case 'suspend':
        return {
          title: 'Suspend User',
          description: 'You are about to suspend this user?',
          warning: 'This will temporarily suspend this user and restrict their access.',
          icon: (
            <svg width='36' height='40' viewBox='0 0 36 40' fill='none' xmlns='http://www.w3.org/2000/svg' className='mt-4'>
              <path d="M10.2177 22.4201C9.77907 22.4201 9.41139 22.2717 9.11466 21.9748C8.81793 21.678 8.66957 21.3101 8.66957 20.8712C8.66957 20.4324 8.81793 20.071 9.11466 19.787C9.41139 19.4902 9.77907 19.3417 10.2177 19.3417H18.4422V8.18974C18.4422 7.76379 18.5905 7.40239 18.8873 7.10552C19.184 6.80865 19.5452 6.66021 19.971 6.66021C20.4096 6.66021 20.7773 6.80865 21.074 7.10552C21.3707 7.40239 21.5191 7.76379 21.5191 8.18974V20.8712C21.5191 21.3101 21.3707 21.678 21.074 21.9748C20.7773 22.2717 20.4096 22.4201 19.971 22.4201H10.2177ZM19.9903 40C17.2553 40 14.6815 39.4772 12.269 38.4318C9.85647 37.3992 7.72779 35.96 5.88292 34.1142C4.05096 32.2685 2.61248 30.1388 1.56749 27.7251C0.522496 25.3114 0 22.7364 0 20C0 17.2636 0.522496 14.6886 1.56749 12.2749C2.61248 9.86125 4.05096 7.73798 5.88292 5.90513C7.72779 4.05937 9.85002 2.61375 12.2496 1.56825C14.6622 0.522749 17.2359 0 19.971 0C22.7189 0 25.2991 0.522749 27.7117 1.56825C30.1242 2.61375 32.2529 4.05937 34.0977 5.90513C35.9426 7.73798 37.3875 9.86125 38.4325 12.2749C39.4775 14.6886 40 17.2636 40 20C40 22.7364 39.4775 25.3114 38.4325 27.7251C37.3875 30.1388 35.9426 32.2685 34.0977 34.1142C32.2529 35.96 30.1242 37.3992 27.7117 38.4318C25.2991 39.4772 22.7254 40 19.9903 40ZM19.9903 36.0503C22.2222 36.0503 24.3058 35.6373 26.2409 34.8112C28.1761 33.9852 29.8791 32.8364 31.3498 31.365C32.8205 29.8935 33.9687 28.1897 34.7944 26.2536C35.6201 24.3175 36.0329 22.233 36.0329 20C36.0329 17.7799 35.6201 15.7018 34.7944 13.7657C33.9687 11.8167 32.8205 10.1065 31.3498 8.63504C29.8791 7.1636 28.1696 6.01484 26.2216 5.18877C24.2864 4.3627 22.2029 3.94966 19.971 3.94966C17.752 3.94966 15.6684 4.3627 13.7204 5.18877C11.7852 6.01484 10.0887 7.1636 8.63087 8.63504C7.17304 10.1065 6.03129 11.8167 5.20561 13.7657C4.37994 15.7018 3.9671 17.7799 3.9671 20C3.9671 22.233 4.37994 24.3175 5.20561 26.2536C6.03129 28.1897 7.17304 29.8935 8.63087 31.365C10.1016 32.8364 11.8045 33.9852 13.7397 34.8112C15.6878 35.6373 17.7713 36.0503 19.9903 36.0503Z" fill="black"/>
            </svg>
          ),
          buttonText: 'Suspend',
          processingText: 'Suspending...',
          successText: 'User suspended successfully!',
          errorText: 'Failed to suspend user. Please try again.',
          selfActionText: 'You cannot suspend your own account.',
        };
      case 'ban':
        return {
          title: 'Ban User',
          description: 'You are about to ban this user?',
          warning: 'This will permanently ban this user and restrict their access.',
          icon: (
            <svg width='36' height='40' viewBox='0 0 36 40' fill='none' xmlns='http://www.w3.org/2000/svg' className='mt-4'>
              <path d="M19.9903 40C17.2553 40 14.6815 39.4772 12.269 38.4318C9.85647 37.3992 7.72779 35.96 5.88292 34.1142C4.05096 32.2685 2.61248 30.1388 1.56749 27.7251C0.522496 25.3114 0 22.7364 0 20C0 17.2636 0.522496 14.6886 1.56749 12.2749C2.61248 9.86125 4.05096 7.73798 5.88292 5.90513C7.72779 4.05937 9.85002 2.61375 12.2496 1.56825C14.6622 0.522749 17.2359 0 19.971 0C22.7189 0 25.2991 0.522749 27.7117 1.56825C30.1242 2.61375 32.2529 4.05937 34.0977 5.90513C35.9426 7.73798 37.3875 9.86125 38.4325 12.2749C39.4775 14.6886 40 17.2636 40 20C40 22.7364 39.4775 25.3114 38.4325 27.7251C37.3875 30.1388 35.9426 32.2685 34.0977 34.1142C32.2529 35.96 30.1242 37.3992 27.7117 38.4318C25.2991 39.4772 22.7254 40 19.9903 40ZM19.9903 36.0503C22.2222 36.0503 24.3058 35.6373 26.2409 34.8112C28.1761 33.9852 29.8791 32.8364 31.3498 31.365C32.8205 29.8935 33.9687 28.1897 34.7944 26.2536C35.6201 24.3175 36.0329 22.233 36.0329 20C36.0329 17.7799 35.6201 15.7018 34.7944 13.7657C33.9687 11.8167 32.8205 10.1065 31.3498 8.63504C29.8791 7.1636 28.1696 6.01484 26.2216 5.18877C24.2864 4.3627 22.2029 3.94966 19.971 3.94966C17.752 3.94966 15.6684 4.3627 13.7204 5.18877C11.7852 6.01484 10.0887 7.1636 8.63087 8.63504C7.17304 10.1065 6.03129 11.8167 5.20561 13.7657C4.37994 15.7018 3.9671 17.7799 3.9671 20C3.9671 22.233 4.37994 24.3175 5.20561 26.2536C6.03129 28.1897 7.17304 29.8935 8.63087 31.365C10.1016 32.8364 11.8045 33.9852 13.7397 34.8112C15.6878 35.6373 17.7713 36.0503 19.9903 36.0503ZM19.9903 23.2139C18.8679 23.2139 18.2874 22.646 18.2487 21.5102L17.9777 12.1007C17.9519 11.5328 18.1261 11.0681 18.5002 10.7067C18.8744 10.3453 19.3582 10.1646 19.9516 10.1646C20.5451 10.1646 21.0353 10.3517 21.4224 10.726C21.8094 11.0874 21.99 11.5457 21.9642 12.1007L21.6546 21.5102C21.6288 22.646 21.074 23.2139 19.9903 23.2139ZM19.9903 29.6418C19.3582 29.6418 18.8163 29.4418 18.3648 29.0416C17.9261 28.6286 17.7068 28.1187 17.7068 27.5121C17.7068 26.9055 17.9261 26.4021 18.3648 26.0019C18.8163 25.5889 19.3582 25.3824 19.9903 25.3824C20.6096 25.3824 21.1385 25.5824 21.5772 25.9826C22.0287 26.3827 22.2545 26.8925 22.2545 27.5121C22.2545 28.1317 22.0287 28.6415 21.5772 29.0416C21.1256 29.4418 20.5967 29.6418 19.9903 29.6418Z" fill="black"/>
            </svg>
          ),
          buttonText: 'Ban',
          processingText: 'Banning...',
          successText: 'User banned successfully!',
          errorText: 'Failed to ban user. Please try again.',
          selfActionText: 'You cannot ban your own account.',
        };
      default:
        return {
          title: 'Action User',
          description: 'You are about to perform an action on this user?',
          warning: 'This will affect this user\'s access.',
          icon: null,
          buttonText: 'Confirm',
          processingText: 'Processing...',
          successText: 'Action completed successfully!',
          errorText: 'Failed to complete action. Please try again.',
          selfActionText: 'You cannot perform this action on your own account.',
        };
    }
  };

  const config = getActionConfig();

  if (!user) return null;

  return (
    <DialogContainer
      title={config.title}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='xl'
    >
      <div className='flex flex-col gap-8 p-3'>
        {config.icon}

        <div className='flex flex-col gap-2'>
          <p className='text-black'>{config.description}</p>
          <p className='text-[#00000080]'>
            {config.warning}
          </p>
          {isActioningSelf && (
            <p className='text-red-500 text-sm font-medium'>
              ⚠️ {config.selfActionText}
            </p>
          )}
        </div>

        <Card className='flex-row gap-4'>
          <img src='/icons/logo.svg' alt='User Image' width={80} height={80} />
          <div className='flex flex-col'>
            <p>{user.name}</p>
            <p className='text-[#808080]'>{user?.role?.role}</p>
          </div>
        </Card>

        <div className='flex flex-col gap-2'>
          <p className='text-[#808080]'>Reason for {action === 'suspend' ? 'Suspension' : 'Ban'} (optional)</p>

          <div className='flex flex-col gap-2 w-fit'>
            {REASONS_FOR_ACTION.map((reason, index) => (
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
            style={{ pointerEvents: isProcessing ? 'none' : 'auto' }}
          >
            Cancel
          </div>
          <button
            type='submit'
            className={`w-3/6 text-center rounded-md py-1 ${
              isActioningSelf 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-black text-white cursor-pointer'
            }`}
            disabled={isProcessing || isActioningSelf}
            onClick={async () => {
              if (isActioningSelf) return;
              
              try {
                setIsProcessing(true);
                await onAction(user.id);
                // Modal will be closed by the onAction function on success
              } catch {
                // Error is handled by onAction function
              } finally {
                setIsProcessing(false);
              }
            }}
          >
            {isProcessing ? config.processingText : isActioningSelf ? `Cannot ${action} Self` : config.buttonText}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
}; 