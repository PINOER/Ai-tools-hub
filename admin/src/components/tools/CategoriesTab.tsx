import React, { useCallback, useState } from "react";
import { useTools } from "@/contexts/ToolsContext";
import { useCategoriesFilters } from "@/hooks/filters/useCategoriesFilters";
import { useCategoriesQuery, useDeleteToolCategoryMutation, useDeleteMultipleToolCategoriesMutation } from "@/hooks/queries/useCategoriesQuery";
import { getCategoryColumns } from "./ToolsTableColumns";
import { DataTabSection } from "@/components/shared/DataTabSection";
import { CategoriesHierarchyView } from "./CategoriesHierarchyView";

type ViewMode = "list" | "hierarchy";

export const CategoriesTab: React.FC = () => {
  const { openModal, closeModal, modals } = useTools();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { filters, updateFilters, clearFilters, filterOptions } =
    useCategoriesFilters();

  const { data: categoriesData, isLoading: loading } =
    useCategoriesQuery(filters);

  const categories = categoriesData?.categories || [];
  const pagination = categoriesData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const { mutate: deleteCategory } = useDeleteToolCategoryMutation();
  const { mutate: deleteCategories } =
    useDeleteMultipleToolCategoriesMutation();

  const removeCategory = (id: number) => deleteCategory(id);
  const removeCategories = (ids: number[]) => deleteCategories(ids);

  const categoryColumns = getCategoryColumns({
    removeCategory,
    removeCategories,
  });

  const handleCreate = useCallback(() => {
    openModal("createCategory");
  }, [openModal]);

  const handleImport = useCallback(() => {
    openModal("importCategory");
  }, [openModal]);

  const handleExport = useCallback(() => {
    openModal("exportCategory");
  }, [openModal]);

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6 ms-4">
        <button
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${
            viewMode === "list"
              ? "bg-[#4D4D4D] text-white"
              : "border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]"
          }`}
          onClick={() => setViewMode("list")}
        >
          List View
        </button>
        <button
          className={`px-4 py-1 text-sm rounded-lg cursor-pointer ${
            viewMode === "hierarchy"
              ? "bg-[#4D4D4D] text-white"
              : "border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]"
          }`}
          onClick={() => setViewMode("hierarchy")}
        >
          Hierarchy
        </button>
      </div>

      {/* Content based on view mode */}
      {viewMode === "list" ? (
        <DataTabSection
          title="Categories"
          filters={filters}
          updateFilters={updateFilters}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
          data={categories}
          loading={loading}
          modals={modals}
          pagination={pagination}
          columns={categoryColumns}
          openModal={openModal}
          closeModal={closeModal}
          onCreate={handleCreate}
          onImport={handleImport}
          onExport={handleExport}
          viewMode="list"
        />
      ) : (
        <DataTabSection
          title="Categories"
          filters={filters}
          updateFilters={updateFilters}
          clearFilters={clearFilters}
          filterOptions={filterOptions}
          data={categories}
          loading={loading}
          modals={modals}
          pagination={pagination}
          columns={categoryColumns}
          openModal={openModal}
          closeModal={closeModal}
          onCreate={handleCreate}
          onImport={handleImport}
          onExport={handleExport}
          viewMode="hierarchy"
          hierarchyComponent={
            <CategoriesHierarchyView
              categories={categories}
              onCategoryUpdate={(updatedCategories) => {
                console.log("Categories updated:", updatedCategories);
              }}
            />
          }
        />
      )}
    </div>
  );
};
