import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import type { Glossary } from '@/types/glossary';
import SaveIcon from '@/components/icons/Save.svg';
import ShareIcon from '@/components/icons/Share.svg';
import CommentIcon from '@/components/icons/Comment.svg';
import StarIcon from '@/components/icons/Star.svg';
import OptionsIcon from '@/components/icons/Options.svg';

interface ViewGlossaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  glossary: Glossary | null;
  openEditModal: () => void;
}

const ViewGlossaryDialog = ({
  open,
  onOpenChange,
  glossary,
  openEditModal
}: ViewGlossaryDialogProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'analytics'>(
    'details'
  );
  if (!glossary) return null;

  const tags = ['#prompt-engineering', '#llm', '#chatgpt'];

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
              Glossary details
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#4D4D4D] text-white'
                  : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Glossary analytics
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
        {/* Top section: title, tags, author, date, edit/close */}
        <div className='flex flex-col items-start justify-between gap-4'>
          <div>
            <div className='text-2xl font-semibold mb-1'>{glossary.term}</div>
            <div className='flex gap-2'>
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className='text-xs text-[#34B1C8] border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full flex justify-end items-center gap-2'>
          <img src={CommentIcon} alt='Comment Icon' />
          <img src={StarIcon} alt='Star Icon' />
          <img src={ShareIcon} alt='Share Icon' />
          <img src={SaveIcon} alt='Saved Icon' />
        </div>
        {/* Details Tab */}
        {activeTab === 'details' && (
          <>
            <div>
              <div className='text-md text-[#00000033] font-medium mb-3'>
                DETAILED DEFINITION
              </div>
              <div className='mb-6 text-[#222] text-sm'>{glossary.definition}</div>
              <div className='text-md text-[#00000033] font-medium mb-3'>
                TAGS
              </div>
              <div className='flex gap-2 items-center justify-start'>
              {glossary.glossary_tags && glossary.glossary_tags.map((tag: string, index: number) => (
                  <span
                    key={`${tag}-${index}`}
                    className='text-xs border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
        {/* Analytics Tab Placeholder */}
        {activeTab === 'analytics' && (
          <div className='flex justify-center items-center h-40 text-[#4D4D4D] text-lg'>
            Glossary analytics coming soon...
          </div>
        )}
      </div>
    </DialogContainer>
  );
};

export default ViewGlossaryDialog;
