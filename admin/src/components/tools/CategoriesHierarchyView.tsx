import React, { useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import type { Category } from '@/types/categories';
import { MoreHorizontal } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CategoriesHierarchyViewProps {
  categories: Category[];
  onCategoryUpdate?: (categories: Category[]) => void;
}

interface HierarchyItem {
  id: string;
  name: string;
  level: number;
  parentId: number | null;
  children: HierarchyItem[];
}

export const CategoriesHierarchyView: React.FC<CategoriesHierarchyViewProps> = ({
  categories,
}) => {

  // Build hierarchy from flat categories
  const buildHierarchy = useMemo(() => {
    const items: HierarchyItem[] = [];
    const itemMap = new Map<string, HierarchyItem>();

    // First pass: create all items
    categories.forEach(cat => {
      const item: HierarchyItem = {
        id: cat.id.toString(),
        name: cat.name,
        level: 0,
        parentId: cat.parentCategoryId,
        children: [],
      };
      items.push(item);
      itemMap.set(item.id, item);
    });

    // Second pass: build hierarchy
    items.forEach(item => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId.toString());
        if (parent) {
          parent.children.push(item);
          item.level = parent.level + 1;
        }
      }
    });

    // Return all items, but group by parent
    const topLevelItems = items.filter(item => !item.parentId);
    
    // If no top-level items, show all items as a flat list
    if (topLevelItems.length === 0) {
      console.log('No top-level items found, showing all items:', items);
      return items;
    }
    
    console.log('Top-level items found:', topLevelItems);
    return topLevelItems;
  }, [categories]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Handle reordering logic here
    console.log('Drag ended:', result);
  };

  const renderHierarchyItem = (item: HierarchyItem, index: number) => {
    return (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`flex items-center justify-between p-3 mb-2 bg-gray-100 rounded-lg border-l-4 ${
              item.level === 0 ? 'border-blue-500' : 'border-green-500'
            } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
            style={{
              marginLeft: `${item.level * 20}px`,
            }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">
                {item.level === 0 ? index + 1 : `${Math.floor(index / 3) + 1}.${(index % 3) + 1}`}
              </span>
              <span className="text-gray-800">{item.name}</span>
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <button className="cursor-pointer">
                  <MoreHorizontal className="text-gray-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-fit p-2 bg-[#333333] text-white rounded-lg shadow-xs">
                <ul className="m-0 list-none p-0">
                  <li className="p-2 cursor-pointer hover:bg-black flex items-center gap-2 rounded-md">
                    <img src="/icons/view.svg" alt="View" width={13} height={13} />
                    View
                  </li>
                  <li className="p-2 cursor-pointer hover:bg-black flex items-center gap-2 rounded-md">
                    <img src="/icons/edit.svg" alt="Edit" width={17} height={17} />
                    Edit
                  </li>
                  <li className="p-2 cursor-pointer hover:bg-primary flex items-center gap-2 rounded-md w-[180px]">
                    <img src="/icons/trash.svg" alt="Delete" width={17} height={17} />
                    Delete
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </Draggable>
    );
  };

  const renderHierarchyLevel = (items: HierarchyItem[], level: number = 0): React.ReactNode => {
    return items.map((item, index) => (
      <div key={item.id}>
        {renderHierarchyItem(item, index)}
        {item.children.length > 0 && (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-300 border-l border-dashed"></div>
            {renderHierarchyLevel(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-4">      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories-hierarchy">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {renderHierarchyLevel(buildHierarchy)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}; 