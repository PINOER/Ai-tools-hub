"use client";
import { useState, useMemo } from "react";
import PromptCard from "@/components/cards/PromptCard";
import FiltersBar from "@/components/filtersBar";
import { COLORS } from "@/utils/constants";
import TagFilter from "@/components/Tags";
import { PromptCardsSkeleton } from "@/components/skeletonCards/PromptCardSkeleton";
// import PromptModal from '@/components/modals/PromptModal';
import { useDebounce } from "@/hooks/useDebounce";
import { usePromptQuery } from "@/hooks/queries/usePromptQuery";

export default function Prompts() {
  const [selectedTagId, setSelectedTagId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedPromptId, setSelectedPromptId] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const PRIMARY_COLOR = COLORS.prompts;
  const [filters, setFilters] = useState<{
    status: string[];
    moderationStatus: string[];
  }>({
    status: [],
    moderationStatus: [],
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">();

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Memoize query filters to ensure React Query detects changes properly
  const queryFilters = useMemo(
    () => ({
      category: selectedTagId !== 0 ? selectedTagId : undefined,
      status: filters.status.length > 0 ? filters.status[0] : undefined,
      moderation_status:
        filters.moderationStatus.length > 0
          ? filters.moderationStatus[0]
          : undefined,
      sort_by: sortDirection,
    }),
    [selectedTagId, filters.status, filters.moderationStatus, sortDirection]
  );

  // Fetch prompts from API with search and pagination using React Query hook
  const {
    data: promptsData,
    isLoading,
    error,
  } = usePromptQuery(currentPage, pageSize, debouncedSearchQuery, queryFilters);

  const filtersData = {
    status: ["Published", "Draft", "Scheduled"],
    moderationStatus: ["Approved", "Rejected", "Pending"],
  };

  const handleFilterChange = (
    key:
      | "pricing"
      | "platform"
      | "roles"
      | "industries"
      | "status"
      | "moderationStatus",
    values: string[]
  ) => {
    if (key === "status" || key === "moderationStatus") {
      setFilters((prev) => ({ ...prev, [key]: values }));
      setCurrentPage(1); // Reset to page 1 whenever filters change
    }
  };

  const prompts = promptsData?.data || [];
  const pagination = promptsData?.pagination;

  // Pagination handlers
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1); // Reset to first page when resetting
  };

  const handleSortChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getCurrentRange = () => {
    if (!pagination) return "1–10 of 0";
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.total);
    return `${start}–${end} of ${pagination.total}`;
  };

  return (
    <div className="flex flex-col justify-center">
      <TagFilter
        activeTag={selectedTagId}
        onChange={setSelectedTagId}
        color={PRIMARY_COLOR}
        section={"Prompt"}
      />
      <div className="mt-4"></div>
      <FiltersBar
        onSearch={handleSearch}
        onReset={handleReset}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentRange={getCurrentRange()}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        canGoPrev={currentPage > 1}
        canGoNext={pagination ? currentPage < pagination.totalPages : false}
        filters={filters} // ✅ pass filters object
        filtersData={filtersData}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortDirection={sortDirection}
      />

      <div className="mt-4 mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Prompts</h2>
      </div>

      {isLoading && <PromptCardsSkeleton />}

      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading prompts. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              // onClick={() => setSelectedPromptId(prompt.id)}
              id={prompt.id}
            />
          ))}
        </div>
      )}

      {/* Prompt Modal */}
      {/* {selectedPromptId && (
                <PromptModal
                    promptId={selectedPromptId}
                    onClose={() => setSelectedPromptId(undefined)}
                />
            )} */}

      {!isLoading && !error && prompts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchQuery
            ? `No prompts found for "${searchQuery}".`
            : "No prompts found."}
        </div>
      )}
    </div>
  );
}
