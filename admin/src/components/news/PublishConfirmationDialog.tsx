import type { News } from '@/types/news';
import DialogContainer from '@/components/DialogContainer';
import NewsDetailGeneric from '@/components/news/NewsDetailGeneric';

interface PublishConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: News | undefined;
}

export const PublishConfirmationDialog = ({
  news,
  onOpenChange,
  open,
}: PublishConfirmationDialogProps) => {
  if (!news) return;
  return (
    <div>
      <DialogContainer
        title='News'
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div className='mt-4'>
          <p>News article has been published</p>

          <NewsDetailGeneric news={news} />

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
