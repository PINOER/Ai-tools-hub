import type { ColumnDef } from '@tanstack/react-table';
import type { Article, ArticleSubmission } from '@/types/article';
import ActionMenu from '@/components/ActionMenu';
import { Checkbox } from '@/components/ui/checkbox';
import { ACTION_KEYS } from '@/hooks/useActionMenu';

interface ArticleTableColumnsProps {
  selectedTab: string;
  setEditDialogOpen: (open: boolean) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setArticleToView: (article: Article | null) => void;
  setArticleDetailsOpen: (open: boolean) => void;
  deleteSelectedArticle: (selectedRows: number[]) => void;
  onApproveModeration?: (id: number) => void;
  onRejectModeration?: (id: number) => void;
  onApproveModerations?: (ids: number[]) => void;
}

export const getArticleColumns = ({
  selectedTab,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setArticleToView,
  setArticleDetailsOpen,
  deleteSelectedArticle,
  onApproveModeration,
  onRejectModeration,
  onApproveModerations,
}: ArticleTableColumnsProps): ColumnDef<Article>[] => [
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
    accessorKey: "headline",
    header: ({ column }) => (
        <p
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer text-sm text-[#00000033]"
        >
        NAME
        </p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "articleCategories[0].category.name",
    accessorFn: (row) => row.articleCategories[0].category.name,
    header: ({ column }) => (
        <p
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer text-sm text-[#00000033]"
        >
          CATEGORY
        </p>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const category = row.original?.articleCategories[0]?.category?.name || '';
      return (
        <span
          className={`text-xs font-semibold border border-[#F2F2F2] px-2 py-1 rounded ${category === "Core Concepts" ? "text-[#FF5A5A]" : "text-[#FF5A5A]"}`}
        >
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: 'user.username',
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
      const statusColors: Record<string, string> = {
        Published: 'bg-[#34C75933] text-[#34C759]',
        Draft: 'bg-[#808080] text-white',
        Scheduled: 'bg-[#FFCC00] text-black',
      };
      
      return (
        <p className={`${statusColors[status] || 'bg-[#808080] text-white'} text-center text-xs px-2 py-1 rounded-full`}>
          {status}
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'moderation_status',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          MODERATION STATUS
        </p>
      );
    },
    cell: ({ row }) => {
      const moderationStatus = row.original?.moderation_status;
      const statusColors: Record<string, string> = {
        Approved: 'bg-[#34C75933] text-[#34C759]',
        Pending: 'bg-[#FFCC00] text-black',
        Rejected: 'bg-[#FF3B30] text-white',
        Under_Review: 'bg-[#007AFF] text-white',
      };
      
      return (
        <p className={`${statusColors[moderationStatus || ''] || 'bg-[#808080] text-white'} text-center text-xs px-2 py-1 rounded-full`}>
          {moderationStatus || 'Pending'}
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
            type='articles'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedArticle(selectedRows),
              [ACTION_KEYS.APPROVE_MODERATIONS]: () => onApproveModerations?.(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type='articles'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => 
          {
            setArticleToView(row.original);
            setArticleDetailsOpen(true);
          },
          [ACTION_KEYS.EDIT]: () => {
            setArticleToView(row.original);
            setEditDialogOpen(true);
          },
          [ACTION_KEYS.APPROVE_MODERATION]: () => onApproveModeration?.(row.original.id),
          [ACTION_KEYS.REJECT_MODERATION]: () => onRejectModeration?.(row.original.id),
          [ACTION_KEYS.DELETE]: () => {
            setArticleToView(row.original);
            setDeleteDialogOpen(true);
          },
        }}
      />
    ),
  },
];

export const getArticleSubmissionsColumns = ({
  selectedTab,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setArticleToView,
  setArticleDetailsOpen,
  deleteSelectedArticle,
}: ArticleTableColumnsProps): ColumnDef<ArticleSubmission>[] => [
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
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          Article NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'user.username',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          SUBMITTED BY
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          SUBMITTED DATE
        </p>
      );
    },
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
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
      const statusColors = {
        Published: 'bg-[#34C75933] text-[#34C759]',
        Draft: 'bg-[#808080] text-white',
        Scheduled: 'bg-[#FFCC00] text-black',
      };
      
      return (
        <p className={`${statusColors[status] || 'bg-[#808080] text-white'} text-center text-xs px-2 py-1 rounded-full`}>
          {status}
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'moderation_status',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          MODERATION STATUS
        </p>
      );
    },
    cell: ({ row }) => {
      const moderationStatus = row.original?.moderation_status;
      const statusColors: Record<string, string> = {
        Approved: 'bg-[#34C75933] text-[#34C759]',
        Pending: 'bg-[#FFCC00] text-black',
        Rejected: 'bg-[#FF3B30] text-white',
        Under_Review: 'bg-[#007AFF] text-white',
      };
      
      return (
        <p className={`${statusColors[moderationStatus || ''] || 'bg-[#808080] text-white'} text-center text-xs px-2 py-1 rounded-full`}>
          {moderationStatus || 'Pending'}
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
            type='articles'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedArticle(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type='articles'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => setArticleDetailsOpen(true),
          [ACTION_KEYS.EDIT]: () => {
            setArticleToView(row.original as any);
            setEditDialogOpen(true);
          },
          [ACTION_KEYS.DELETE]: () => {
            setArticleToView(row.original as any);
            setDeleteDialogOpen(true);
          },
        }}
      />
    ),
  },
]; 