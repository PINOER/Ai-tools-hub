import type { ColumnDef } from '@tanstack/react-table';
import type { News } from '@/types/news';
import ActionMenu from '@/components/ActionMenu';
import { Checkbox } from '@/components/ui/checkbox';
import { ACTION_KEYS } from '@/hooks/useActionMenu';
import { NewsStatus } from '@/types/news';

interface NewsTableColumnsProps {
  selectedTab: string;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setNewsToView: (news: News | null) => void;
  setNewsDetailsOpen: (open: boolean) => void;
  deleteSelectedNews: (selectedRows: number[]) => void;
  onApproveModeration?: (id: number) => void;
  onRejectModeration?: (id: number) => void;
  onApproveModerations?: (ids: number[]) => void;
}

export const getNewsColumns = ({
  selectedTab,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setNewsToView,
  setNewsDetailsOpen,
  deleteSelectedNews,
}: NewsTableColumnsProps): ColumnDef<News>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          ID
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'featuredImage',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          IMAGE
        </p>
      );
    },
    cell: ({ row }) => {
      if (row.original?.user?.avatar)
        return (
          <img
            src={row.original.user.avatar}
            alt='Avatar'
            width={20}
            height={20}
          />
        );
      return null;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'headline',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          HEADLINE
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'tool_categories[0].category.name',
    accessorFn: (row) => row.newsCategories[0]?.category?.name,
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          CATEGORY
        </p>
      );
    },
    cell: ({ row }) => {
      const category = row.original.newsCategories[0]?.category?.name;
      return (
        <span className='text-xs font-semibold border-2 border-[#F2F2F2] px-2 py-1 rounded text-[#34C759]'>
          {category || 'No category'}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'userId',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          OWNER
        </p>
      );
    },
    cell: ({ row }) => {
      return row.original?.user?.email || '';
    },
    enableSorting: true,
  },
  {
    accessorKey: 'featured',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          FEATURED
        </p>
      );
    },
    cell: ({ row }) => {
      if (row.original.is_featured)
        return (
          <img
            src='/icons/featured.svg'
            alt='Featured Icon'
            width={20}
            height={20}
          />
        );
      return null;
    },
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          STATUS
        </p>
      );
    },
    cell: ({ row }) => {
      const status = row.original?.status;
      if (status === NewsStatus.Published) {
        return (
          <p className='bg-[#34C75933] rounded-2xl px-3 py-1 text-xs w-fit text-center text-[#34C759]'>
            {NewsStatus.Published}
          </p>
        );
      } else {
        return (
          <p className='bg-[#4D4D4D] rounded-2xl px-3 py-0.5 w-fit text-center'>
            {NewsStatus.Draft}
          </p>
        );
      }
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
            type='news'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedNews(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type='news'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => {
            setNewsToView(row.original);
            setNewsDetailsOpen(true);
          },
          [ACTION_KEYS.EDIT]: () => {
            setNewsToView(row.original);
            setEditDialogOpen(true);
          },
          [ACTION_KEYS.DELETE]: () => {
            setNewsToView(row.original);
            setDeleteDialogOpen(true);
          },
        }}
      />
    ),
  },
]; 