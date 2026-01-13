import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";
import { IoStar } from "react-icons/io5";
import { Bookmark } from "@/types/api";

// Mock bookmark data - In a real app, this would come from an API
const mockBookmarks: Bookmark[] = [
  {
    id: 1,
    type: 'AI Tools',
    title: 'Midjourney',
    description: 'AI-powered image generation from text descriptions',
    tags: ['Image Generation', 'Art', 'Design Tools'],
    rating: 2.4,
    backgroundColor: '#C13B3B',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    type: 'AI Tools',
    title: 'ChatGPT',
    description: 'Advanced AI assistant for conversations and tasks',
    tags: ['Conversational AI', 'Writing', 'Productivity'],
    rating: 4.5,
    backgroundColor: '#10A37F',
    created_at: '2024-01-10',
  },
  {
    id: 3,
    type: 'News',
    title: 'AI Breakthrough in Healthcare',
    description: 'Latest developments in AI-powered medical diagnostics',
    tags: ['Healthcare', 'Medical AI', 'Innovation'],
    backgroundColor: '#007AFF',
    created_at: '2024-01-12',
  },
  {
    id: 4,
    type: 'Articles',
    title: 'Future of Machine Learning',
    description: 'Exploring the next decade of ML developments',
    tags: ['Machine Learning', 'Future Tech', 'Research'],
    backgroundColor: '#FF6B35',
    created_at: '2024-01-08',
  },
  {
    id: 5,
    type: 'Learning',
    title: 'Deep Learning Course',
    description: 'Comprehensive course on neural networks and deep learning',
    tags: ['Education', 'Deep Learning', 'Neural Networks'],
    backgroundColor: '#8E44AD',
    created_at: '2024-01-05',
  },
  {
    id: 6,
    type: 'Prompts',
    title: 'Creative Writing Prompts',
    description: 'Collection of AI prompts for creative writing',
    tags: ['Writing', 'Creativity', 'Prompts'],
    backgroundColor: '#E74C3C',
    created_at: '2024-01-03',
  },
  {
    id: 7,
    type: 'Glossary',
    title: 'AI Terminology Guide',
    description: 'Comprehensive glossary of AI and ML terms',
    tags: ['Reference', 'Terminology', 'Education'],
    backgroundColor: '#27AE60',
    created_at: '2024-01-01',
  },
];

interface BookMarksDataProps {
  selectedCategory?: string;
}

export default function BookMarksData({ selectedCategory = 'AI Tools' }: BookMarksDataProps) {
  // Filter bookmarks based on selected category
  const filteredBookmarks = mockBookmarks.filter(bookmark =>
    bookmark.type === selectedCategory
  );

  const totalBookmarks = mockBookmarks.length;
  const categoryCount = filteredBookmarks.length;

  return (
    <>
      <p className="font-[inter] font-medium text-[15px] text-[#CCCCCC] mt-[40px]">
        Bookmarks {totalBookmarks}
      </p>
      <p className="font-[inter] font-medium text-[15px] text-[#CCCCCC] mt-[20px]">
        {selectedCategory.toUpperCase()} {categoryCount}
      </p>

      {filteredBookmarks.length === 0 ? (
        <div className="flex flex-col justify-center items-center border border-dashed border-[#F2F2F2] h-[127px] rounded-[10px] mt-[20px]">
          <div className="flex gap-3">
            <Image src="/Group.svg" alt="group" width={24} height={27} />
            <p className="font-medium text-[20px] text-[#808080]">No {selectedCategory.toLowerCase()} bookmarked</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mt-[8px]">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="flex flex-wrap">
              <div
                className="w-[80px] h-[80px] border border-gray-200 rounded-[10px]"
                style={{ backgroundColor: bookmark.backgroundColor }}
              />
              <div className="ml-[20px] flex flex-col flex-1">
                <p className="font-[inter] font-medium text-[15px] text-[#000000]">
                  {bookmark.title}
                </p>
                <p className="font-[inter] font-medium text-[15px] text-[#808080] mb-[8px]">
                  {bookmark.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {bookmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#FFFFFF] border border-gray-200 text-[#007AFF] font-[Nunito] font-bold text-[12px] px-2 py-0 rounded-[6px] mb-[4px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  {bookmark.rating && (
                    <span className="bg-[#FFFFFF] border border-gray-200 text-[#808080] w-[55px] font-[Nunito] font-bold text-[12px] px-2 py-0.5 rounded-[6px]">
                      <span className="flex items-center">
                        <IoStar className="mr-[4px] w-[15px] h-[15px]" />
                        {bookmark.rating}
                      </span>
                    </span>
                  )}
                  <span className="bg-[#FFFFFF] border border-gray-200 text-[#808080] font-[Nunito] font-bold text-[12px] px-2 py-0.5 rounded-[6px] flex items-center">
                    <GoArrowUpRight width={15} height={15} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}