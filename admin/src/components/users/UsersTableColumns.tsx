import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import ActionMenu from '@/components/ActionMenu';
import type { User } from '@/types/user';
import { getUserStatusColor } from '@/lib/utils';
import { ACTION_KEYS } from '@/hooks/useActionMenu';

interface GetUsersColumnsProps {
  setEditDialogOpen: () => void;
  setUserDetailsOpen: () => void;
  setDeleteDialogOpen: () => void;
  setUserToView: (user: User) => void;
  onBanUser: (user: User) => void;
  onSuspendUser: (user: User) => void;
  onActivateUser: (user: User) => void;
  deleteSelectedUsers: (userIds: number[]) => void;
  banUsers: (userIds: number[]) => void;
  suspendUsers: (userIds: number[]) => void;
  activateUsers: (userIds: number[]) => void;
}

export function getUsersColumns({
  setEditDialogOpen,
  setUserDetailsOpen,
  setDeleteDialogOpen,
  setUserToView,
  onBanUser,
  onSuspendUser,
  onActivateUser,
  deleteSelectedUsers,
  banUsers,
  suspendUsers,
  activateUsers,
}: GetUsersColumnsProps): ColumnDef<User>[] {
  return [
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
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          USER ID
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          USER NAME
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          EMAIL
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'first_name',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          FIRST NAME
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'last_name',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          LAST NAME
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'role.role',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          ROLE
        </p>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='cursor-pointer text-sm text-[#00000033]'
        >
          STATUS
        </p>
      ),
      cell: ({ row }) => {
        const status = row.original?.status;
        return (
          <span className={`${getUserStatusColor(status)} text-center text-xs px-2 py-1 rounded-full w-fit`}>
            {status}
          </span>
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
            .rows.map((selected) => selected.original.id);
          return (
            <ActionMenu
              type='users'
              selectedTab={null}
              handlers={{
                [ACTION_KEYS.DELETE_MULTIPLE]: () => deleteSelectedUsers(selectedRows),
                [ACTION_KEYS.BAN_USERS]: () => banUsers(selectedRows),
                [ACTION_KEYS.SUSPEND_USERS]: () => suspendUsers(selectedRows),
                [ACTION_KEYS.ACTIVATE_USERS]: () => activateUsers(selectedRows),
              }}
            />
          );
        }
        return '';
      },
      cell: ({ row }) => (
        <ActionMenu
          row={row.original}
          type='users'
          selectedTab={null}
          handlers={{
            [ACTION_KEYS.VIEW]: () => {
              setUserToView(row.original);
              setUserDetailsOpen();
            },
            [ACTION_KEYS.EDIT]: () => {
              setUserToView(row.original);
              setEditDialogOpen();
            },
            [ACTION_KEYS.DELETE]: () => {
              setUserToView(row.original);
              setDeleteDialogOpen();
            },
            [ACTION_KEYS.BAN_USER]: () => onBanUser(row.original),
            [ACTION_KEYS.SUSPEND_USER]: () => onSuspendUser(row.original),
            [ACTION_KEYS.ACTIVATE_USER]: () => onActivateUser(row.original),
          }}
        />
      ),
    },
  ];
} 