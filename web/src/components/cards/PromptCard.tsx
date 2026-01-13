import { Prompt } from '@/types/api';
import { COLORS } from '@/utils/constants';
import Link from 'next/link';

type PromptCardProps = {
    prompt: Prompt;
    color?: string;
    // onClick?: () => void;
    id: number;
  };
  
  export default function PromptCard({ prompt, color = COLORS.prompts, id}: PromptCardProps) {
    // Parse tags from string to array
    const tags = prompt.tags ? prompt.tags.split(',').map(tag => tag.trim()) : [];
    
    // Get the first category name as icon/emoji or use default
    const categoryName = prompt.promptCategories?.[0]?.category?.name || '';
    const icon = getCategoryIcon(categoryName);
    
    return (
      <Link href={`/prompts/${id}`}>
      <div 
        className="bg-[#F7F7F7] border border-[#F2F2F2] rounded-[9px] px-[10px] py-[12px] h-[70px] transition cursor-pointer hover:bg-gray-50 hover:border-gray-300"
        // onClick={onClick}
      >
        <h3 className="text-[15px] font-medium flex items-center gap-2">
          <span>{icon}</span>
          {prompt.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className={`text-[12px] font-[Nunito] font-semibold bg-[#FFFFFF] px-[6px] py-[1px] rounded-[5px]`}
              style={{
                color: color
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      </Link>
    );
  }

  // Helper function to get icon based on category
  function getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'Prompt Engineering': '⚙️',
      'Creative Writing': '✍️',
      'Business': '💼',
      'Marketing': '📢',
      'Programming': '💻',
      'Analysis': '📊',
      'SEO': '🔍',
      'Email': '📧',
      'Social Media': '📱',
      'Education': '📚',
      'Default': '💡'
    };
    
    return iconMap[categoryName] || iconMap['Default'];
  }