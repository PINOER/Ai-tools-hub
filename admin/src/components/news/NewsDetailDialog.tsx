import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { NEWS_DETAILS_TABS } from '@/lib/contants';
import DialogContainer from '@/components/DialogContainer';
import type { News } from '@/types/news';
import NewsDetailGeneric from '@/components/news/NewsDetailGeneric';
import NewsDetails from '@/components/news/NewsDetails';

interface NewsDetailsDialogProps {
  news: News | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: number) => void;
  setEditDialogOpen?: (open: boolean) => void;
}

export const NewsDetailsDialog = ({
  news,
  open,
  onOpenChange,
  onDelete,
  setEditDialogOpen,
}: NewsDetailsDialogProps) => {
  const [selectedTab, setSelectedTab] = useState(
    NEWS_DETAILS_TABS.news_details
  );
  const [openHeaderOptions, setOpenHeaderOptions] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // const [editDialogOpen, setEditDialogOpen] = useState(false);

  const DeleteListItem = () => (
    <li
      className='p-1 rounded-md cursor-pointer hover:bg-primary flex items-center gap-2 text-center'
      onClick={() => {
        onDelete(news!.id);
      }}
    >
      <img src='/icons/trash.svg' alt='Delete Row' width={17} height={17} />
      Delete
    </li>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenHeaderOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!news) return null;

  return (
    <div>
      <DialogContainer
        title={null}
        open={open}
        onOpenChange={onOpenChange}
        maxWidth='4xl'
      >
        <div
          className='flex items-center justify-between w-full px-8 py-2'
          ref={ref}
        >
          <div className='flex items-center gap-4 text-sm'>
            <p
              className={`rounded-md py-1 px-4 cursor-pointer ${
                selectedTab === NEWS_DETAILS_TABS.news_details
                  ? 'bg-[#4D4D4D] text-white'
                  : 'bg-white border-2 border-[#F2F2F2]'
              }`}
              onClick={() => setSelectedTab(NEWS_DETAILS_TABS.news_details)}
            >
              News details
            </p>
            <p
              className={`rounded-md py-1 px-4 cursor-pointer ${
                selectedTab === NEWS_DETAILS_TABS.news_analytics
                  ? 'bg-[#4D4D4D] text-white'
                  : 'bg-white border-2 border-[#F2F2F2]'
              }`}
              onClick={() => setSelectedTab(NEWS_DETAILS_TABS.news_analytics)}
            >
              News analytics
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div
              className='relative px-1 py-1 border rounded-md border-[#F2F2F2] cursor-pointer'
              onClick={() => setOpenHeaderOptions(!openHeaderOptions)}
            >
              <MoreHorizontal />
              {openHeaderOptions && (
                <div className='absolute top-8 right-8 z-10! min-w-[110px] shadow-xs rounded-lg bg-[#333333] text-white text-center backdrop-blur-xs drop-shadow-[20] drop-shadow-(color:#00000033)'>
                  <ul className='m-0 list-none p-[0.5rem] z-10'>
                    <DeleteListItem />
                  </ul>
                </div>
              )}
            </div>
            <div
              // @ts-ignore
              onClick={() => setEditDialogOpen(true)}
              className='flex items-center justify-center gap-2 text-sm cursor-pointer bg-black text-white rounded-md px-4 py-1'
            >
              Edit
              <img
                src='/icons/edit.svg'
                alt='Edit News'
                width={17}
                height={17}
              />
            </div>
            <svg
              width='12'
              height='12'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='cursor-pointer'
              onClick={() => onOpenChange(false)}
            >
              <path
                d='M0.322681 15.677C0.177061 15.5379 0.0810839 15.3723 0.0347502 15.1801C-0.0115834 14.988 -0.0115834 14.7959 0.0347502 14.6037C0.087703 14.4116 0.18368 14.2493 0.322681 14.1168L6.41886 7.99503L0.322681 1.88323C0.18368 1.75072 0.0910125 1.58841 0.0446789 1.39627C-0.00165477 1.20414 -0.00165477 1.01201 0.0446789 0.819876C0.0910125 0.627743 0.18368 0.462112 0.322681 0.322981C0.468301 0.177226 0.637088 0.0811594 0.829041 0.0347826C1.02099 -0.0115942 1.21295 -0.0115942 1.4049 0.0347826C1.59686 0.0811594 1.76233 0.173913 1.90133 0.313043L8.00745 6.42484L14.1036 0.313043C14.2426 0.167288 14.4081 0.0745342 14.6001 0.0347826C14.792 -0.0115942 14.9807 -0.0115942 15.166 0.0347826C15.3579 0.0811594 15.53 0.177226 15.6823 0.322981C15.8213 0.462112 15.914 0.627743 15.9603 0.819876C16.0132 1.01201 16.0132 1.20414 15.9603 1.39627C15.914 1.58178 15.8213 1.74741 15.6823 1.89317L9.5861 7.99503L15.6823 14.1068C15.8213 14.2526 15.914 14.4215 15.9603 14.6137C16.0066 14.7992 16.0066 14.988 15.9603 15.1801C15.914 15.3723 15.8213 15.5379 15.6823 15.677C15.5367 15.8228 15.3679 15.9188 15.1759 15.9652C14.984 16.0116 14.792 16.0116 14.6001 15.9652C14.4081 15.9188 14.2426 15.8261 14.1036 15.687L8.00745 9.57516L1.90133 15.687C1.76233 15.8261 1.59686 15.9188 1.4049 15.9652C1.21957 16.0116 1.02761 16.0116 0.829041 15.9652C0.637088 15.9188 0.468301 15.8228 0.322681 15.677Z'
                                  fill='black'
                  fillOpacity='0.2'
              />
            </svg>
          </div>
        </div>

        <div>
          <NewsDetailGeneric news={news} />
          {selectedTab === NEWS_DETAILS_TABS.news_details && (
            <NewsDetails news={news} />
          )}
        </div>
        {selectedTab === NEWS_DETAILS_TABS.news_analytics && (
          <div className='h-[54vh] text-[#808080] flex items-center justify-center'>
            Put google analytics metrics here
          </div>
        )}
      </DialogContainer>
    </div>
  );
};
