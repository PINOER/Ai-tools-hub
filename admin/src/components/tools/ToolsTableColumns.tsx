import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import ActionMenu from '@/components/ActionMenu';
import {  ToolsStatus, type Tools, type ToolSubmission } from '@/types/tools';
import { type Category } from '@/types/categories';
import { getToolsStatusColor } from '@/lib/utils';
import { ACTION_KEYS } from '@/hooks/useActionMenu';

interface ToolsTableColumnsProps {
  selectedTab: string;
  setEditDialogOpen?: (open: boolean) => void;
  setToolClaimDetailsDialogOpen?: (open: boolean) => void;
  setDeleteDialogOpen?: (open: boolean) => void;
  setToolToView: (tool: Tools | null) => void;
  setToolDetailsOpen?: (open: boolean) => void;
  approveSubmission?: (id: number) => void;
  rejectSubmission?: (id: number) => void;
  deleteSubmission?: (id: number) => void;
  deleteSelectedTools?: (selectedRows: number[]) => void;
  approveSubmissions?: (selectedRows: number[]) => void;
  rejectSubmissions?: (selectedRows: number[]) => void;
  deleteSubmissions?: (selectedRows: number[]) => void;
  deleteClaims?: (selectedRows: number[]) => void;
  updateClaims?: (selectedRows: number[], status: ToolsStatus) => void;
  updateClaimStatus?: (id: number, status: ToolsStatus) => void;
  deleteClaim?: (id: number) => void;
}

interface CategoryTableColumnsProps {
  removeCategory?: (id: number) => void;
  removeCategories?: (selectedRows: number[]) => void;
}

export const getToolsColumns = ({
  selectedTab,
  setEditDialogOpen,
  setDeleteDialogOpen,
  setToolToView,
  setToolDetailsOpen,
  deleteSelectedTools,
}: ToolsTableColumnsProps): ColumnDef<Tools>[] => [
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
    accessorKey: 'avatar',
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
      if (row?.original?.avatar)
        return (
          <img
            src={row.original.avatar || ''}
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
    accessorKey: 'name',
    accessorFn: (row) => row.name,
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          TOOL NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'category.name',
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
      const category = row.original.tool_categories?.[0]?.category?.name;
      const name = typeof category === 'object' && category !== null
        ? category
        : String(category ?? '');
        
      return (
        <span className="inline-block bg-white text-[#0080FF] rounded-[10px] px-3 py-1 font-semibold text-[12px]">
          {name}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'user.email',
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
    accessorKey: 'is_featured',
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
        return (
          <p className={`${getToolsStatusColor(status)} text-center text-xs px-2 py-1 rounded-full`}>
            {status}
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
            type='tools'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedTools?.(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type='tools'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => 
          {
            setToolToView(row.original);
            setToolDetailsOpen?.(true)

          },
          [ACTION_KEYS.EDIT]: () => {
            setToolToView(row.original);
            setEditDialogOpen?.(true);
          },
          [ACTION_KEYS.DELETE]: () => {
            setToolToView(row.original);
            setDeleteDialogOpen?.(true);
          },
        }}
      />
    ),
  },
];

export const getSubmissionColumns = ({
  selectedTab,
  setToolToView,
  setToolDetailsOpen,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  approveSubmissions,
  deleteSubmissions,
}: ToolsTableColumnsProps): ColumnDef<ToolSubmission>[] => [
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
    accessorKey: 'tool.avatar',
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
      if (row?.original?.tool?.avatar)
        return (
          <img
            src={row.original.tool.avatar || ''}
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
    accessorKey: 'tool.name',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          TOOL NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'tool.category.name',
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
      const category = row.original.tool.tool_categories?.[0]?.category?.name;
      const name = typeof category === 'object' && category !== null
        ? category
        : String(category ?? '');
        
      return (
        <span className="inline-block bg-white text-[#0080FF] rounded-[10px] px-3 py-1 font-semibold text-[12px]">
          {name}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'user.email',
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
    accessorKey: 'is_featured',
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
      if (row.original?.tool?.is_featured)
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
      if (!status) return null;
      return (
        <p className={`${getToolsStatusColor(status)} text-center text-xs px-2 py-1 rounded-full`}>
          {status}
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
            type='tools'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSubmissions?.(selectedRows),
              [ACTION_KEYS.APPROVE_SUBMISSIONS]: () => approveSubmissions?.(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original?.tool}
        type='tools'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => 
          {
            setToolToView(row.original?.tool);
            setToolDetailsOpen?.(true);
          },
          [ACTION_KEYS.APPROVE_SUBMISSION]: () => approveSubmission?.(row.original.id),
          [ACTION_KEYS.REJECT_SUBMISSION]: () => rejectSubmission?.(row.original.id),
          [ACTION_KEYS.DELETE]: () => deleteSubmission?.(row.original.id),
        }}
      />
    ),
  },
];

export const getClaimsColumns = ({
  selectedTab,
  setToolToView,
   deleteClaims,
  updateClaims,
  deleteClaim,
  updateClaimStatus,
  setToolClaimDetailsDialogOpen
}: ToolsTableColumnsProps): ColumnDef<any>[] => [
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
    accessorKey: 'tool.avatar',
    accessorFn: (row) => row.tool?.avatar || '',
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
      if (row.original?.tool?.avatar)
        return (
          <img
            src={row.original.tool.avatar}
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
    accessorKey: 'tool.name',
    accessorFn: (row) => row.tool?.name || '',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          TOOL NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'tool.category.name',
    accessorFn: (row) => row.tool?.category?.name || '',
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
      const category = row.original?.tool?.tool_categories?.[0]?.category?.name;
      const name = typeof category === 'object' && category !== null
        ? category
        : String(category ?? '');
        
      return (
        <span className="inline-block bg-white text-[#0080FF] rounded-[10px] px-3 py-1 font-semibold text-[12px]">
          {name}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          CLAIMANT
        </p>
      );
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
      if (!status) return null;
      return (
        <p className={`${getToolsStatusColor(status)} text-center text-xs px-2 py-1 rounded-full`}>
          {status}
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
            type='tools'
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteClaims?.(selectedRows),
              [ACTION_KEYS.APPROVE_CLAIMS]: () => updateClaims?.(selectedRows, ToolsStatus.Approved),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original?.tool}
        type='tools'
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => {
            setToolToView(row.original?.tool);
            setToolClaimDetailsDialogOpen?.(true);
          },
          [ACTION_KEYS.APPROVE_CLAIM]: () => {
            setToolToView(row.original?.tool);
            setToolClaimDetailsDialogOpen?.(true);
          },
          [ACTION_KEYS.DELETE]: () => deleteClaim?.(row.original.id),
          [ACTION_KEYS.REJECT_CLAIM]: () => updateClaimStatus?.(row.original.id, ToolsStatus.Rejected),
        }}
      />
    ),
  },
];

export const getCategoryColumns = ({
  removeCategory,
  removeCategories
}: CategoryTableColumnsProps): ColumnDef<Category>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'parent_category',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          PARENT
        </p>
      );
    },
    cell: ({ row }) => {
      const parentName = row.original.parent_category?.name;
      return (
        <span className="text-sm">
          {parentName || '-'}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'items',
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-muted-foreground'
        >
          ITEMS
        </p>
      );
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
    cell: () => {
      return (
        <p className="bg-green-100 text-green-800 text-center text-xs px-2 py-1 rounded-full">
          Active
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
            type='tools'
            selectedTab='tool_categories'
            handlers={{
              [ACTION_KEYS.DELETE_CATEGORIES]: () => removeCategories?.(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type='tools'
        selectedTab='tool_categories'
        handlers={{
          [ACTION_KEYS.DELETE_CATEGORY]: () => removeCategory?.(row.original.id),
        }}
      />
    ),
  },
];