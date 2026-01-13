import { useState } from 'react';
import { GenericDataTable } from '@/components/shared/GenericDataTable';
import { getCategoryColumns } from '../tools/ToolsTableColumns';
import { useCategoriesQuery } from '@/hooks/queries/useCategoriesQuery';
import { CategoriesHierarchyView } from '../tools/CategoriesHierarchyView';

export const LearningCategoriesTab = () => {
  const [categoriesView, setCategoriesView] = useState<'list' | 'hierarchy'>('list');

  const { data, isLoading } = useCategoriesQuery({ section: 'Learning' });
  const categories = data?.categories || [];

  const columns = getCategoryColumns({
    removeCategory: () => {},
    removeCategories: () => {},
  });

  return (
    <div className="space-y-4">
      <div className='flex gap-2 mb-4'>
        <button
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${categoriesView === 'list' ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
          onClick={() => setCategoriesView('list')}
        >
          List view
        </button>
        <button
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${categoriesView === 'hierarchy' ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
          onClick={() => setCategoriesView('hierarchy')}
        >
          Hierarchy
        </button>
      </div>

      {categoriesView === 'list' ? (
        <GenericDataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
        />
      ) : (
        <CategoriesHierarchyView categories={categories} />
      )}
    </div>
  );
};
