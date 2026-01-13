import type { ScreenType } from '@/types';
import clsx from 'clsx';
import { MoreHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import React from 'react';
import { useActionMenu } from '@/hooks/useActionMenu';

type ActionMenuProps = {
  row?: any;
  type: ScreenType;
  selectedTab: string | null;
  handlers: Record<string, () => void>;
};

const ActionMenu: React.FC<ActionMenuProps> = ({
  row,
  type,
  selectedTab,
  handlers
}) => {


  const { rowActions, bulkActions } = useActionMenu(type, selectedTab, row);
  const actions = row ? rowActions : bulkActions;

  const ActionItem: React.FC<{ action: any }> = ({ action }) => {
    const handler = handlers[action.key];
    
    return (
      <li
        className={`p-2 flex items-center gap-2 rounded-md w-[180px] cursor-pointer ${action.className}`}
        onClick={() => !action.disabled && handler?.()}
      >
        <img
          src={action.icon}
          alt={action.label}
          width={action.icon.includes('checkmark') || action.icon.includes('ban') ? 19 : 17}
          height={action.icon.includes('checkmark') || action.icon.includes('ban') ? 19 : 17}
          className={action.disabled ? 'opacity-50' : ''}
        />
        {action.label}
      </li>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className='cursor-pointer'>
          <MoreHorizontal className={clsx(row ? 'text-[#CCCCCC]' : 'text-black')} />
        </button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-fit p-2 bg-[#333333] text-white rounded-lg shadow-xs'>
        <ul className='m-0 list-none p-0'>
          {actions.map((action) => (
            <ActionItem key={action.key} action={action} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default ActionMenu;