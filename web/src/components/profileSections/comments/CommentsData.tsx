import React from 'react';
import type { Comment } from '@/types/components';
import { GoThumbsup } from 'react-icons/go';

interface CommentsDataProps {
  comments?: Comment[];
}

const CommentsData: React.FC<CommentsDataProps> = ({ comments }) => {
  const safeComments = comments ?? [];
  if (!safeComments.length) {
    return <div className="text-gray-400">No comments found.</div>;
  }
  return (
    <div className="flex flex-col gap-6 mt-[20px]">
      {safeComments.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-1 mb0-8 border px-[20px] py-[12px] border-[#F2F2F2] rounded-[15px] bg-[#F7F7F7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium font-[inter] text-[15px]">{comment.tool}</span>
            </div>
            <span className="font-medium text-[15px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
          </div>
          <div className="font-medium text-[15px] text-[#4D4D4D] mt-1">
            {comment.comment}
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <button className="flex items-center border border-gray-200 rounded-[8px]  px-2 py-1 gap-1 w-fit cursor-pointer mt-1">
              <GoThumbsup />
              0
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsData;