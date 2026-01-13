import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';

// Custom Checkbox for row selection
function CustomCheckbox({ checked, onChange }: { checked: boolean; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="relative flex items-center justify-center w-[15px] h-[15px]">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={`peer appearance-none w-[15px] h-[15px] border-2 ${checked ? 'border-black' : 'border-[#E6E6E6]'} rounded-[3px] bg-white checked:bg-white checked:border-black focus:ring-0 focus:outline-none`}
        />
        {checked && (
          <svg
            className="absolute left-1/2 top-1/2 w-[12px] h-[12px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polyline points="5 11 9 15 15 7" stroke="black" strokeWidth="2" fill="none" />
          </svg>
        )}
      </span>
    </label>
  );
}

interface GenericDataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  // Generic filter component
  FilterComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
}

export function GenericDataTable<T>({
  columns,
  data,
  isLoading = false,
  FilterComponent,
}: GenericDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Validate data structure
  const validData = Array.isArray(data) ? data : [];

  const fallbackColumns = columns.length === 0 ? [
    {
      id: 'fallback',
      header: 'Data',
      cell: ({ row }: any) => <div>{JSON.stringify(row.original)}</div>
    }
  ] : columns;
  
  const table = useReactTable({
    data: validData,
    columns: fallbackColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true, // Temporarily disable for testing
    // pageCount: Math.ceil(totalRecords / currentLimit),
  });


  return (
    <div className='w-full border-0 ring-0 shadow-none rounded-none [&_thead]:border-none [&_tr]:border-none [&_th]:border-none [&_td]:border-none'>
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === 'select') {
                    return (
                      <TableHead key={header.id} className='!text-[#CCCCCC]'>
                        <label className="inline-flex items-center cursor-pointer">
                          <span className="relative flex items-center justify-center w-[15px] h-[15px]">
                            <input
                              type="checkbox"
                              checked={table.getIsAllRowsSelected()}
                              onChange={table.getToggleAllRowsSelectedHandler()}
                              ref={el => {
                                if (el) el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
                              }}
                              className={`peer appearance-none w-[15px] h-[15px] border-2 ${table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? 'border-black' : 'border-[#E6E6E6]'} rounded-[3px] bg-white focus:ring-0 focus:outline-none`}
                            />
                            {/* Dash icon for indeterminate */}
                            {table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected() ? (
                              <svg
                                className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <line x1="6" y1="10" x2="14" y2="10" stroke="black" strokeWidth={2} />
                              </svg>
                            ) : table.getIsAllRowsSelected() ? (
                              <svg
                                className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <polyline points="5 11 9 15 15 7" stroke="black" strokeWidth={2} fill="none" />
                              </svg>
                            ) : null}
                          </span>
                        </label>
                      </TableHead>
                    );
                  }
                  return (
                    <TableHead key={header.id} className='!text-[#CCCCCC]'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={fallbackColumns.length}
                  className='h-24 text-center text-[#808080] text-[15px]'
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={fallbackColumns.length}
                  className='h-24 text-center text-[#808080] text-[15px]'
                >
                  No data provided
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'select') {
                      return (
                        <TableCell key={cell.id}>
                          <CustomCheckbox
                            checked={row.getIsSelected()}
                            onChange={row.getToggleSelectedHandler()}
                          />
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center text-[#808080] text-[15px]'
                >
                  No data found (Data exists but no rows generated)
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {FilterComponent && (
        <FilterComponent
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
        />
      )}
    </div>
  );
} 