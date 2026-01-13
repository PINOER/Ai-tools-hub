import Image from "next/image";
import CommentsData from './CommentsData';
import { Comment } from "@/types/components";

interface CommentsProps {
  comments: Comment[];
  loading: boolean;
  isError: boolean;
}

export default function Comments({ comments, loading, isError }: CommentsProps) {


  if (loading) {
    return <div className="mt-[40px] ml-1">Loading...</div>;
  }

  if (isError) {
    return <div className="mt-[40px] ml-1 text-red-500">Failed to load comments.</div>;
  }

  if (!comments.length) {
    return (
      <div className="mt-[40px] ml-1 flex flex-col justify-center items-center border border-dashed border-[#F2F2F2] h-[68px] rounded-[10px]">
        <div className="flex gap-3">
          <Image src="/comments.svg" alt="group" width={28} height={28} />
          <p className="font-medium text-[20px] font-[Inter] text-[#808080]">No comments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[40px] ml-1">
      <p className="font-medium text-[15px] text-[#CCCCCC] mb-[20px] ml-1">Comments {comments.length}</p>
      <CommentsData comments={comments} />
    </div>
  );
}