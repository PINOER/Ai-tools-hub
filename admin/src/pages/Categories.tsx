import { DataTabSection } from '@/components/shared/DataTabSection';
import type { Category } from '@/types/categories';
import { useEffect, useState } from 'react';
import {
  createCategoryApi,
  getCategoriesApi,
} from '@/api/categories';
import type { ColumnDef } from '@tanstack/react-table';
import ActionMenu from '@/components/ActionMenu';
import { ACTION_KEYS } from '@/hooks/useActionMenu';
import { TableSkeleton } from '@/components/TableSkeleton';
import { useUser } from '@/hooks/useUser';

export default function Categories() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const columns: ColumnDef<Category>[] = [
    //  checkbox - if we wanna select the rows through checkbox
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label='Select all'
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label='Select row'
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: 'id',
      header: ({ column }) => {
        return (
          <p
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='cursor-pointer text-sm text-muted-foreground'
          >
            ID
            {/* <ArrowUpDown /> */}
          </p>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <p
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='cursor-pointer text-sm text-muted-foreground'
          >
            NAME
            {/* <ArrowUpDown /> */}
          </p>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: 'order',
      header: ({ column }) => {
        return (
          <p
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className='cursor-pointer text-sm text-muted-foreground'
          >
            ORDER
            {/* <ArrowUpDown /> */}
          </p>
        );
      },
      enableSorting: true,
    },
    {
      id: 'action',
      header: ({ table }) => {
        const selectedCount = table.getSelectedRowModel().rows.length;

        if (selectedCount) {
          const selectedRows = table
            .getSelectedRowModel()
            .rows.map((selected) => {
              return selected.original.id;
            });
          return (
            <ActionMenu
              type='categories'
              selectedTab=''
              handlers={{
                [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedCategories(selectedRows),
              }}
            />
          );
        }
      },
      cell: ({ row }) => (
        <ActionMenu
          row={row.original}
          type='categories'
          selectedTab=''
          handlers={{
            [ACTION_KEYS.DELETE]: () => {},
          }}
        />
      ),
    },
  ];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const userHook = useUser();

  const updateFilters = (updates: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const openModal = (modal: string) => {
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: string) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCategoriesApi({ section: 'Tool' });
        setCategories(data.categories);
        setPagination(prev => ({
          ...prev,
          total: data.categories.length,
          totalPages: Math.ceil(data.categories.length / prev.limit),
        }));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userHook.token]);

  const createCategory = async () => {
    setLoading(true);
    try {
      const data = {
        name: 'Test4',
        section: 'Tool',
        url_slug: 'test4',
        description: 'Test category',
        display_order: 6,
        seo_title: 'Test4',
        parentCategoryId: null,
        parent_category: null,
      };
      const createdCategory: Category = await createCategoryApi(
        data,
      );
      setCategories((prev) => [...prev, createdCategory]);
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  // const deleteCategory = async (id: number) => {
  //   setLoading(true);
  //   try {
  //     await deleteCategoryApi(id, userHook.token!);
  //     setCategories((prev) => prev.filter((category) => category.id !== id));
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deleteSelectedCategories = async (selectedRows: number[]) => {
    setLoading(true);
    try {
      // TODO:
      console.log(selectedRows);
    } catch (error) {
      console.error('Error deleting categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className='px-10 pt-12 mt-10'>
      <div className='text-[#00000033] text-xl'>
        Categories <span className='text-[#00000080]'>{categories.length}</span>
      </div>

      <DataTabSection
        title="Categories"
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        filterOptions={[]}
        data={categories}
        loading={loading}
        modals={modals}
        pagination={pagination}
        columns={columns}
        openModal={openModal}
        closeModal={closeModal}
        onCreate={createCategory}
        onImport={() => {}}
        onExport={() => {}}
      />
    </div>
  );
}
