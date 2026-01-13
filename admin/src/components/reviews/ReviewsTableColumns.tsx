import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ActionMenu from "@/components/ActionMenu";
import { ReviewStatus, type Review } from "@/types/reviews";
import { getReviewStatusColor } from "@/lib/utils";
import { ACTION_KEYS } from "@/hooks/useActionMenu";

interface ReviewsTableColumnsProps {
  selectedTab: string;
  setReviewDetailsOpen: (open: boolean) => void;
  onDeleteSingle: (id: number) => void;
  onApproveReview: (id: number) => void;
  setReviewToView: (review: Review) => void;
  onDeleteMultipleReviews?: (selectedRows: number[]) => void;
  onUpdateMultipleReviews?: (selectedRows: number[]) => void;
}

export const getReviewColumns = ({
  selectedTab,
  setReviewDetailsOpen,
  onDeleteSingle,
  onApproveReview,
  setReviewToView,
  onDeleteMultipleReviews,
  onUpdateMultipleReviews,
}: ReviewsTableColumnsProps): ColumnDef<Review>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          ID
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "tool.name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          TOOL NAME
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "user.first_name",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          USER
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          DATE
        </p>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "overall_rating",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          RATING
        </p>
      );
    },
    cell: ({ row }) => {
      const rating = row.getValue("overall_rating") as number;
      return (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-sm text-gray-500">({rating}/5)</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer text-sm text-muted-foreground"
        >
          STATUS
        </p>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as ReviewStatus;
      const color = getReviewStatusColor(status);
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
          {status}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
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
            type="reviews"
            selectedTab={selectedTab}
            handlers={{
              [ACTION_KEYS.APPROVE_REVIEWS]: () =>
                onUpdateMultipleReviews?.(selectedRows),
              [ACTION_KEYS.DELETE_MULTIPLE]: () =>
                onDeleteMultipleReviews?.(selectedRows),
            }}
          />
        );
      }
    },
    cell: ({ row }) => (
      <ActionMenu
        row={row.original}
        type="reviews"
        selectedTab={selectedTab}
        handlers={{
          [ACTION_KEYS.VIEW]: () => {
            setReviewToView(row.original);
            setReviewDetailsOpen(true);
          },
          [ACTION_KEYS.APPROVE_REVIEW]: () => onApproveReview(row.original.id),
          [ACTION_KEYS.DELETE]: () => onDeleteSingle(row.original.id),
        }}
      />
    ),
  },
];
