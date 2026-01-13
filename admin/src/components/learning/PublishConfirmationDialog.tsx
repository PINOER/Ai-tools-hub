import type { Learning } from '@/types/learning';
import DialogContainer from '@/components/DialogContainer';
import { LearningDetailGeneric } from './LearningDetailGeneric';

interface PublishConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learning: Learning | undefined;
}

export const PublishConfirmationDialog = ({
  learning,
  onOpenChange,
  open,
}: PublishConfirmationDialogProps) => {
  if (!learning) return;
  return (
    <div>
      <DialogContainer
        title='learning'
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div className='mt-4'>
          <p>learning article has been published</p>

          <LearningDetailGeneric learning={learning} />

          {/* BUTTONS */}
          <div className='flex items-center gap-3'>
            <button
              type='submit'
              className='w-full text-center bg-black text-white rounded-md py-1 cursor-pointer'
              onClick={() => onOpenChange(false)}
            ></button>
          </div>
        </div>
      </DialogContainer>
    </div>
  );
};
