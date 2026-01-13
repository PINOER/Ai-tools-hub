import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import type { Article } from '@/types/article';
import OptionsIcon from '@/components/icons/Options.svg';
import { ArticleDetailGeneric } from './ArticleDetailGeneric';
import ArticleDetails from './ArticleDetails';

interface ViewArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article | null;
  openEditModal: () => void;
}

const ViewArticleDialog = ({
  open,
  onOpenChange,
  article,
  openEditModal
}: ViewArticleDialogProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'analytics'>(
    'details'
  );
  if (!article) return null;
  
  return (
    <DialogContainer
      title={null}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth='4xl'
    >
      <div className='flex flex-col gap-[20px] p-4'>
        <div className='flex justify-between items-center'>
          {/* Tabs */}
          <div className='flex gap-2'>
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-[#4D4D4D] text-white'
                  : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Article details
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#4D4D4D] text-white'
                  : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Article analytics
            </button>
          </div>
          <div className='flex gap-2 items-center justify-end'>
            <img src={OptionsIcon} alt='Options Icon' />
            <button onClick={openEditModal} className='bg-[#000000] rounded-lg px-3 py-1.5 text-xs flex items-center text-white gap-2'>
              Edit{' '}
              <img src='/icons/edit.svg' alt='Edit' width={12} height={12} />
            </button>
            <button className='ml-2' onClick={() => onOpenChange(false)}>
              <span className='text-2xl text-[#888]'>&times;</span>
            </button>
          </div>
        </div>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="w-[80%] m-auto py-6">
          <ArticleDetailGeneric article={article} />
          <ArticleDetails article={article} />
        </div>
        )}
        {/* Analytics Tab Placeholder */}
        {activeTab === 'analytics' && (
          <div className='flex justify-center items-center h-40 text-[#4D4D4D] text-lg'>
            Article analytics coming soon...
          </div>
        )}
      </div>
    </DialogContainer>
  );
};

export default ViewArticleDialog;