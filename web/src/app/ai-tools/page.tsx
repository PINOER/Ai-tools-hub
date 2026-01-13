"use client";
import { useState, useCallback } from "react";
import TagFilter from "@/components/Tags";
import ToolCard from "@/components/cards/ToolCard";
import { ToolCardSkeleton } from "@/components/skeletonCards/ToolCardSkeleton";
import FilterBar from "@/components/filtersBar";
import ToolModal from "@/components/modals/ToolModal";
import LoginModal from "@/components/modals/LoginModal";
import { CreateToolDialog } from "@/components/tools/CreateToolDialog";
// import { useIsMobile } from "@/hooks/useIsMobile";
import { useDebounce } from "@/hooks/useDebounce";
import { useCategoriesQuery } from "@/hooks/queries/useCategoriesQuery";
import { useToolRolesQuery } from "@/hooks/queries/useToolRolesQuery";
import { useToolIndustriesQuery } from "@/hooks/queries/useToolIndustriesQuery";
import { Tool } from "@/types/api";
import { useGetToolsQuery } from "@/hooks/queries/useToolsQuery";
import { useUser } from "@clerk/nextjs";
import { FilterBarProps } from "@/types/components";
import { dummyTags } from "@/utils/constants";

const PRIMARY_COLOR = "#007AFF";

export default function AiTools() {
  const { isSignedIn: isAuthenticated } = useUser();
  const [selectedTagId, setSelectedTagId] = useState(0); // Changed from 1 to 0 for "All"
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<number | undefined>(
    undefined
  );
  const [gridLayout, setGridLayout] = useState(2);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filters, setFilters] = useState<{
    roles: number[];
    industries: number[];
    pricing: string[];
    platform: string[];
  }>({
    roles: [],
    industries: [],
    pricing: [],
    platform: [],
  });

  // Fetch tool roles
  const { data: rolesData } = useToolRolesQuery({
    page: 1,
    limit: 50,
  });

  // Fetch tool industries
  const { data: industriesData } = useToolIndustriesQuery({
    page: 1,
    limit: 50,
  });

  const filtersData = {
    roles: rolesData?.data?.map((i: any) => i.name),
    industries: industriesData?.data?.map((i: any) => i.name),
    pricing: [
      "Free",
      "Paid",
      "Freemium",
      "Subscription",
      "PaidOnly",
      "OneTimePurchase",
    ],
    platform: ["Web", "Desktop", "MobileApp", "BrowserExtension", "Api"],
  };

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const roleNameToId = new Map(
    (rolesData?.data || []).map((r: any) => [r.name, r.id])
  );
  const industryNameToId = new Map(
    (industriesData?.data || []).map((i: any) => [i.name, i.id])
  );

  // Collect selected IDs from filters
  const selectedRoleIds = filters.roles
    .map((name) => roleNameToId.get(name))
    .filter((id): id is number => !!id);

  const selectedIndustryIds = filters.industries
    .map((name) => industryNameToId.get(name))
    .filter((id): id is number => !!id);

  // React Query for data fetching with dynamic page, limit, debounced search, filters, and sort
  const { data, isLoading, error } = useGetToolsQuery(
    currentPage,
    pageSize,
    debouncedSearchTerm,
    {
      tool_role_ids: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
      tool_industry_ids:
        selectedIndustryIds.length > 0 ? selectedIndustryIds : undefined,
      pricing_model: filters.pricing.length > 0 ? filters.pricing : undefined,
      platform_availability:
        filters.platform.length > 0 ? filters.platform : undefined,
      sort_by: sortDirection,
      category_id: selectedTagId !== 0 ? selectedTagId : undefined, // Changed from 1 to 0 for "All"
    }
  );

  // Fetch categories using the useCategoriesQuery hook
  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategoriesQuery({
      section: "Tool",
      limit: 50,
    });

  const tools = data?.tools || [];
  const pagination = data?.pagination;
  const categories = categoriesData?.categories || [];

  const handleFilterChange = (
    key: keyof NonNullable<FilterBarProps["filters"]>,
    values: any[]
  ) => {
    // Only update filters for keys that exist in our local filters state
    if (key in filters) {
      setFilters((prev) => ({ ...prev, [key]: values }));
      setCurrentPage(1); // Reset to page 1 whenever filters change
    }
  };

  const handleGridChanged = (gridLayout: number) => {
    setGridLayout(gridLayout);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1); // Reset to first page when resetting
  }, []);

  const handleSortChange = useCallback((direction: "asc" | "desc") => {
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, []);

  const getGridClasses = (layout: number) => {
    switch (layout) {
      case 1:
        return "grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2";
    }
  };

  const getCurrentRange = () => {
    if (!pagination) return "1–10 of 0";
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.total);
    return `${start}–${end} of ${pagination.total}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedToolId(undefined);
  };

  const handleAddClick = () => {
    if (!categoriesLoading) {
      if (isAuthenticated) {
        setShowCreateDialog(true);
      } else {
        setShowLoginModal(true);
      }
    }
  };

  const handleCreateDialogClose = () => {
    setShowCreateDialog(false);
  };

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="flex flex-col justify-center">
      <TagFilter
        activeTag={selectedTagId}
        onChange={setSelectedTagId}
        color={PRIMARY_COLOR}
      />
      <div className="mt-6"></div>

      <FilterBar
        onSearch={handleSearch}
        onReset={handleReset}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentRange={getCurrentRange()}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        canGoPrev={currentPage > 1}
        canGoNext={pagination ? currentPage < pagination.totalPages : false}
        showAiToolsControls={true}
        onGridClick={handleGridChanged}
        currentGridLayout={gridLayout}
        onAddClick={handleAddClick}
        filters={filters} // ✅ pass filters object
        filtersData={filtersData}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortDirection={sortDirection}
      />

      <div className={`grid ${getGridClasses(gridLayout)} gap-4 mt-4`}>
        {isLoading ? (
          Array.from({ length: pageSize }).map((_, idx) => (
            <ToolCardSkeleton key={idx} />
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500 py-8">
            Error loading tools. Please try again.
          </div>
        ) : tools.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            <div className="text-lg font-medium mb-2">No tools found</div>
            <div className="text-sm text-gray-400">
              {searchTerm
                ? `No tools match your search for "${searchTerm}"`
                : "No tools available at the moment."}
            </div>
          </div>
        ) : (
          tools?.map((tool: Tool) => (
            <ToolCard
              key={tool.id}
              logo={tool.avatar}
              name={tool.name}
              description={tool.short_description}
              tags={tool.tool_tags?.map((t) => t.tag.name) || []}
              stars={tool.rating || 0}
              websiteUrl={tool.website_url}
              toolId={tool.id}
            />
          ))
        )}
      </div>
      {showModal && (
        <ToolModal onClose={handleCloseModal} toolId={selectedToolId} />
      )}

      {showCreateDialog && (
        <CreateToolDialog
          open={showCreateDialog}
          onOpenChange={handleCreateDialogClose}
          categories={categoriesLoading ? [] : categories}
          tags={dummyTags}
        />
      )}

      <LoginModal isOpen={showLoginModal} onClose={handleLoginModalClose} />
    </div>
  );
}
