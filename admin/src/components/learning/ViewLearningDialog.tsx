import DialogContainer from '../DialogContainer';
import { useState } from 'react';
import type { Learning } from '@/types/learning';
import SaveIcon from '@/components/icons/Save.svg';
import ShareIcon from '@/components/icons/Share.svg';
import CommentIcon from '@/components/icons/Comment.svg';
import StarIcon from '@/components/icons/Star.svg';
import OptionsIcon from '@/components/icons/Options.svg';

interface ViewLearningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  learning: Learning | null;
  openEditModal: () => void;
}

const ViewLearningDialog = ({
  open,
  onOpenChange,
  learning,
  openEditModal,
}: ViewLearningDialogProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'analytics'>(
    'details'
  );
  if (!learning) return null;

  const tags = ['Best Practices', 'Tutorials'];
  const videoId = new URL(learning.lesson_link).searchParams.get("v");
  
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
              Learning details
            </button>
            <button
              className={`px-2 py-1 text-xs rounded-lg cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#4D4D4D] text-white'
                  : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Learning analytics
            </button>
          </div>
          <div className='flex gap-2 items-center justify-end'>
            <img src={OptionsIcon} alt='Options Icon' />
            <button
              onClick={openEditModal}
              className='bg-[#000000] rounded-lg px-3 py-1.5 text-xs flex items-center text-white gap-2'
            >
              Edit{' '}
              <img src='/icons/edit.svg' alt='Edit' width={12} height={12} />
            </button>
            <button className='ml-2' onClick={() => onOpenChange(false)}>
              <span className='text-2xl text-[#888]'>&times;</span>
            </button>
          </div>
        </div>
        <div className='px-10'>
          <div className='flex flex-col items-start justify-between gap-4'>
            <div className='w-full h-[400px]'>
              <iframe
              width='100%'
              height='100%'
              src={`https://www.youtube.com/embed/${videoId}`}
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='rounded-xl'
            />
          </div>
            <div>
              <div className='text-2xl font-semibold mb-1'>
                {learning.title}
              </div>
              <div className='mb-6 text-[#222] text-sm'>{learning.content}</div>
              <div className='flex gap-2 items-center justify-start'>
              {learning.learningTags && learning.learningTags.length > 0 && learning.learningTags.map((learningTag: any) => (
                  <span
                    key={learningTag.tag.id}
                    className='text-xs border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg'
                  >
                    #{learningTag.tag.name}
                  </span>
                ))}
              </div>
              <div className='flex items-center gap-4 mt-2'>
                <p className='text-[#808080] text-sm'>{learning.published_date || 'May 22, 2025'}</p>
                <p className='text-[#808080] text-sm flex items-center gap-1 cursor-pointer'>
                  <span>
                    <svg
                      width='13'
                      height='12'
                      viewBox='0 0 13 12'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M2.50683 11.625C1.41894 11.625 0.875 11.2797 0.875 10.5891C0.875 10.1796 1.00512 9.75 1.26536 9.30032C1.52986 8.85064 1.90742 8.43108 2.39804 8.04162C2.89292 7.65217 3.48592 7.33699 4.17705 7.09609C4.86817 6.85118 5.64462 6.72872 6.5064 6.72872C7.35964 6.72872 8.13183 6.85118 8.82295 7.09609C9.51834 7.33699 10.1113 7.65217 10.602 8.04162C11.0926 8.43108 11.468 8.85064 11.7282 9.30032C11.9927 9.75 12.125 10.1796 12.125 10.5891C12.125 11.2797 11.5811 11.625 10.4932 11.625H2.50683ZM2.30205 10.5831H10.7044C10.7769 10.5831 10.8281 10.5711 10.8579 10.547C10.8921 10.5229 10.9091 10.4827 10.9091 10.4265C10.9091 10.1937 10.8131 9.92867 10.6212 9.63156C10.4292 9.33043 10.1433 9.03935 9.76365 8.7583C9.38822 8.47323 8.92747 8.23836 8.3814 8.05367C7.83532 7.86496 7.21032 7.77061 6.5064 7.77061C5.79821 7.77061 5.16894 7.86496 4.6186 8.05367C4.07253 8.23836 3.61177 8.47323 3.23635 8.7583C2.86092 9.03935 2.57509 9.33043 2.37884 9.63156C2.18686 9.92867 2.09087 10.1937 2.09087 10.4265C2.09087 10.4827 2.1058 10.5229 2.13567 10.547C2.1698 10.5711 2.22526 10.5831 2.30205 10.5831ZM6.5064 6.02409C5.99019 6.02409 5.51877 5.89561 5.09215 5.63865C4.6698 5.38169 4.33276 5.03841 4.08106 4.60881C3.82935 4.17519 3.7035 3.6974 3.7035 3.17546C3.7035 2.66154 3.82935 2.19379 4.08106 1.77222C4.33276 1.34663 4.6698 1.00736 5.09215 0.754416C5.51877 0.501472 5.99019 0.375 6.5064 0.375C7.02261 0.375 7.49189 0.499465 7.91425 0.748394C8.34087 0.997323 8.6779 1.33257 8.92534 1.75415C9.17705 2.17572 9.3029 2.64548 9.3029 3.16341C9.3029 3.68937 9.17705 4.16916 8.92534 4.60278C8.67363 5.0364 8.3366 5.38169 7.91425 5.63865C7.49189 5.89561 7.02261 6.02409 6.5064 6.02409ZM6.5064 4.97618C6.80503 4.97618 7.07807 4.89789 7.32551 4.7413C7.57295 4.5807 7.77133 4.36389 7.92065 4.09087C8.06997 3.81384 8.14462 3.50468 8.14462 3.16341C8.14462 2.83017 8.06997 2.53306 7.92065 2.27208C7.77133 2.00709 7.57295 1.79831 7.32551 1.64574C7.07807 1.49317 6.80503 1.41689 6.5064 1.41689C6.20776 1.41689 5.93473 1.49518 5.68729 1.65177C5.43985 1.80434 5.24147 2.01312 5.09215 2.2781C4.94283 2.54309 4.86817 2.84221 4.86817 3.17546C4.86817 3.51271 4.94283 3.81986 5.09215 4.09689C5.24147 4.36991 5.43985 4.58472 5.68729 4.7413C5.93899 4.89789 6.21203 4.97618 6.5064 4.97618Z'
                        fill='#808080'
                      />
                    </svg>
                  </span>
                  {learning.user.username}
                </p>
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
                  TAGS
                </div>
                <div className='flex gap-2 items-center justify-start'>
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className='text-xs border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Analytics Tab Placeholder */}
          {activeTab === 'analytics' && (
            <div className='flex justify-center items-center h-40 text-[#4D4D4D] text-lg'>
              Learning analytics coming soon...
            </div>
          )}
        </div>
      </div>
    </DialogContainer>
  );
};

export default ViewLearningDialog;
