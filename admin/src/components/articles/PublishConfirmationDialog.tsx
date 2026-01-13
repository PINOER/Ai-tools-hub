import type { Article } from '@/types/article';
import DialogContainer from '@/components/DialogContainer';
import { ArticleDetailGeneric } from './ArticleDetailGeneric';

interface PublishConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article | undefined;
}

export const PublishConfirmationDialog = ({
  article,
  onOpenChange,
  open,
}: PublishConfirmationDialogProps) => {
  if (!article) return;
  return (
    <div>
      <DialogContainer
        title='article'
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div className='mt-4'>
          <p>Article has been published</p>

          <ArticleDetailGeneric article={article} />

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
