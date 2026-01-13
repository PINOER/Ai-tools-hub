import { PersonIcon } from '../icons';
import type { Learning } from '@/types/learning';

interface LearningDetailGenericProps {
  learning: Omit<Learning, 'id'>;
}

export const LearningDetailGeneric = ({
  learning,
}: LearningDetailGenericProps) => {
  const videoId = new URL(learning.lesson_link).searchParams.get("v");

  return (
    <div className='flex flex-col gap-2'>
      <div className='w-full h-[300px]'>
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
      <div className='text-2xl font-normal mb-1'>{learning.title}</div>
      <div className='flex gap-2 mb-2'>
        {learning.learningCategories?.map((cat: any) => (
          <span
            key={cat.category.id}
            className='text-xs text-[#34B1C8] border border-[#F2F2F2] px-2 py-1 rounded-lg'
          >
            {cat.category.name}
          </span>
        ))}
      </div>
      <div className='flex gap-4 text-sm text-[#808080] items-center'>
        <span>{learning.published_date || 'May 22, 2025'}</span>
        {learning.user.username && <div className='flex justify-center items-center gap-4'>
          <PersonIcon width={11} height={11} color='#808080' />
          <span className='-ml-3'>{learning.user.username}</span>
        </div>}
      </div>
    </div>
  );
};
