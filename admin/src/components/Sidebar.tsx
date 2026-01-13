import { useState } from 'react';
import { HomeIcon, PersonIcon, ToolsIcon, NewsIcon, ArticleIcon, LearningIcon, PromptsIcon, GlossaryIcon, ReviewsIcon, SubmissionsIcon, NewsletterIcon, CategoriesIcon } from './icons';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import MenuToggler from '@/components/MenuToggler';

const sidebarItems = [
  { icon: HomeIcon, label: 'Home', path: '/', activeBg: 'bg-[#4D4D4D]' },
  { icon: PersonIcon, label: 'Users', path: '/users', section: 'USERS', activeBg: 'bg-[#4D4D4D]' },
  { icon: ToolsIcon, label: 'AI tools', path: '/ai-tools', section: 'TOOLS', activeBg: 'bg-[#007AFF]' },
  { icon: NewsIcon, label: 'News', path: '/news', section: 'CONTENT', activeBg: 'bg-[#34C759]' },
  { icon: ArticleIcon, label: 'Articles', path: '/articles', activeBg: 'bg-[#00C7BE]' },
  { icon: LearningIcon, label: 'Learning', path: '/learning', activeBg: 'bg-[#AF52DE]' },
  { icon: PromptsIcon, label: 'Prompts', path: '/prompts', activeBg: 'bg-[#30B0C7]' },
  { icon: GlossaryIcon, label: 'Glossary', path: '/glossary', activeBg: 'bg-[#FF2D55]' },
  { icon: ReviewsIcon, label: 'Reviews', path: '/reviews', section: 'OTHER', activeBg: 'bg-[#4D4D4D]' },
  { icon: SubmissionsIcon, label: 'Submissions', path: '/submissions', activeBg: 'bg-[#4D4D4D]' },
  { icon: NewsletterIcon, label: 'Newsletters', path: '/newsletters', activeBg: 'bg-[#4D4D4D]' },
  { icon: CategoriesIcon, label: 'Categories', path: '/categories', activeBg: 'bg-[#4D4D4D]' },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const renderSection = (sectionName: string) => (
    !collapsed && (
      <div className='text-xs font-normal text-[#CCCCCC] uppercase tracking-wider mb-2 px-3'>
        {sectionName}
      </div>
    )
  );

  return (
    <div
      className={cn(
        'h-screen flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className={cn('pt-5 flex items-center justify-between gap-2', collapsed ? 'px-2' : 'px-7')}>
        <Logo collapsed={collapsed} />
        <MenuToggler onClick={() => setCollapsed((prev) => !prev)} collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className='flex-1 py-10 overflow-y-auto'>
        <div className='space-y-1 pl-5'>
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const showSection =
              item.section &&
              (index === 0 || sidebarItems[index - 1].section !== item.section);

            return (
              <div key={item.path}>
                {showSection && renderSection(item.section)}
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 py-2 mx-3 rounded-lg text-sm font-medium transition-colors',
                    collapsed ? 'justify-center px-0' : 'px-2',
                    isActive
                      ? 'bg-[#E5E5E5]'
                      : 'hover:bg-[#E5E5E5]/60'
                  )}
                >
                  <item.icon color={isActive?'white':'#CCCCCC'} className={`w-7 h-7 text-[#CCCCCC] ${isActive ? item.activeBg : 'bg-[#F2F2F2]'}  p-[5px] rounded-[5px]`} />
                  {!collapsed && (
                    <span className={`${isActive ? 'text-black' : 'text-[#808080]'} font-normal text-[15px]`}>{item.label}</span>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
