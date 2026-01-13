"use client";
import { useState, useMemo } from "react";
import FiltersBar from "@/components/filtersBar";
import { COLORS } from "@/utils/constants";
import { GlossaryTermCategory } from "@/types/api";
// import GlossaryModal from "@/components/modals/GlossaryModal";
import { GlossaryCardSkeleton } from "@/components/skeletonCards/GlossaryCardSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import TagFilter from "@/components/Tags";
import React from "react"; // Added missing import
import { useGlossaryQuery } from "@/hooks/queries/useGlossaryQuery";
import Link from "next/link";

export default function Glossary() {
  const [selectedTag, setSelectedTag] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    status: string[];
    moderationStatus: string[];
  }>({
    status: [],
    moderationStatus: [],
  });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">();
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const PRIMARY_COLOR = COLORS.glossary;

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  // Memoize query filters to ensure React Query detects changes properly
  const queryFilters = useMemo(
    () => ({
      category: selectedTag === 0 ? undefined : selectedTag,
      status: filters.status.length > 0 ? filters.status[0] : undefined,
      moderation_status:
        filters.moderationStatus.length > 0
          ? filters.moderationStatus[0]
          : undefined,
      sort_by: sortDirection,
    }),
    [selectedTag, filters.status, filters.moderationStatus, sortDirection]
  );

  // Fetch glossary data from API with pagination
  const {
    data: glossaryResponse,
    isLoading,
    error,
  } = useGlossaryQuery(
    currentPage,
    pageSize,
    debouncedSearchQuery,
    queryFilters
  );

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

  const glossaryData = glossaryResponse?.data?.terms || [];
  const pagination = glossaryResponse?.data?.pagination;

  // const handleTermClick = (term: GlossaryTerm) => {
  //   setSelectedTerm(term);
  //   setModalOpen(true);
  // };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  // Reset to first page when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedTag]);

  const handleSortChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading glossary</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <TagFilter
        activeTag={selectedTag}
        onChange={setSelectedTag}
        color={PRIMARY_COLOR}
        section={"Glossary"}
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <FiltersBar
          onSearch={setSearchTerm}
          onReset={() => setSearchTerm("")}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          currentRange={`${(currentPage - 1) * pageSize + 1}–${Math.min(
            currentPage * pageSize,
            pagination?.total || 0
          )} of ${pagination?.total || 0}`}
          onPrev={() => handlePageChange(currentPage - 1)}
          onNext={() => handlePageChange(currentPage + 1)}
          canGoPrev={currentPage > 1}
          canGoNext={pagination ? currentPage < pagination.totalPages : false}
          filters={filters} // ✅ pass filters object
          filtersData={filtersData}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          sortDirection={sortDirection}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-3">
          {isLoading
            ? // Show skeleton cards while loading
              [...Array(pageSize)].map((_, index) => (
                <GlossaryCardSkeleton key={index} />
              ))
            : // Show actual glossary cards
              glossaryData.map((item, index) => (
                <Link href={`/glossary/${item.id}`} key={index}>
                  <div
                    key={index}
                    // onClick={() => handleTermClick(item)}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h3 className="font-semibold text-lg mb-2">{item.term}</h3>
                    {item.definition && (
                      <p className="text-gray-600 text-sm mb-3">
                        {item.definition}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {item.glossary_categories.map(
                        (cat: GlossaryTermCategory, catIndex: number) => (
                          <span
                            key={catIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {cat.category.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* {modalOpen && selectedTerm && (
          <GlossaryModal
            term={selectedTerm}
            onClose={() => setModalOpen(false)}
          />
        )} */}

        {!isLoading && glossaryData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No glossary terms found.
          </div>
        )}
      </div>
    </div>
  );
}
