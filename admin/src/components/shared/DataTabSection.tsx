import { useCallback, useMemo } from "react";
import { DataTableControls } from "@/components/shared/DataTableControls";
import { GenericDataTable } from "@/components/shared/GenericDataTable";
import { GenericFilterModal } from "@/components/shared/GenericFilterModal";
import { PlusIcon } from "lucide-react";
import PlusIconImg from "/icons/PlusIcon.svg";

interface DataTabSectionProps<T> {
  title: string;
  filters: Record<string, any>;
  updateFilters: (updates: Record<string, any>) => void;
  clearFilters: () => void;
  filterOptions: any[];
  data: T[];
  loading: boolean;
  modals: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  columns: any;
  openModal: (modal: any) => void;
  closeModal: (modal: any) => void;
  onCreate: () => void;
  onImport: () => void;
  onExport: () => void;
  viewMode?: 'list' | 'hierarchy';
  hierarchyComponent?: React.ReactNode;
  hideControls?: boolean;
  showPagination?: boolean;
  showFilters?: boolean;
  showSearch?: boolean;
}

export const DataTabSection = <T,>({
  title,
  filters,
  updateFilters,
  clearFilters,
  filterOptions,
  data,
  loading,
  modals,
  pagination,
  columns,
  openModal,
  closeModal,
  onCreate,
  onImport,
  onExport,
  viewMode = 'list',
  hierarchyComponent,
  hideControls = false,
  showPagination = true,
  showFilters = true,
  showSearch = true,
}: DataTabSectionProps<T>) => {
  const handlePreviousPage = useCallback(() => {
    if (pagination.page > 1) {
      updateFilters({ page: pagination.page - 1 });
    }
  }, [pagination.page, updateFilters]);

  const handleNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages) {
      updateFilters({ page: pagination.page + 1 });
    }
  }, [pagination.page, pagination.totalPages, updateFilters]);

  const handleLimitChange = useCallback(
    (limit: number) => {
      updateFilters({ limit, page: 1 });
    },
    [updateFilters]
  );

  const handleSearch = useCallback(
    (search: string) => {
      updateFilters({ search, page: 1 });
    },
    [updateFilters]
  );

  const handleFilterOpen = useCallback(() => {
    openModal('filterModal');
  }, [openModal]);

  const formattedFilterOptions = useMemo(() => {
    return filterOptions
      .filter((option) =>
        ["select", "text", "multiselect", "checkbox"].includes(option.type)
      )
      .map((option) => ({
        key: option.key,
        label: option.label,
        type: option.type as "select" | "text" | "multiselect" | "checkbox",
        options: option.options,
      }));
  }, [filterOptions]);

  return (
    <div>
      {!hideControls && (
        <>
          <DataTableControls
            FilterComponent={showFilters}
            onFilterOpen={handleFilterOpen}
            searchValue={filters.search || ""}
            onSearchChange={handleSearch}
            currentPage={pagination.page}
            currentLimit={pagination.limit}
            totalRecords={pagination.total}
            onLimitChange={handleLimitChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onImport={onImport}
            onExport={onExport}
            onCreate={onCreate}
            PlusIcon={PlusIcon}
            PlusIconImg={PlusIconImg}
            isData={data.length > 0}
            showPagination={showPagination}
            showSearch={showSearch}
          />

          <GenericFilterModal
            filters={formattedFilterOptions}
            values={filters}
            onChange={updateFilters as any}
            open={modals.filterModal}
            onOpenChange={(open) =>
              open ? openModal("filterModal") : closeModal("filterModal")
            }
            onClear={clearFilters}
            title={`Filter ${title}`}
          />
        </>
      )}

      {viewMode === 'list' ? (
        <GenericDataTable columns={columns} data={data} isLoading={loading} />
      ) : (
        hierarchyComponent
      )}
    </div>
  );
}; 