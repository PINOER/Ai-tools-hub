"use client";
import React from "react";
import { useState, useMemo } from "react";
import NewsCard from "@/components/cards/NewsCard";
import TagFilter from "@/components/Tags";
import FiltersBar from "@/components/filtersBar";
import { useNews } from "@/hooks/queries/useNewsQuery";
import { useDebounce } from "@/hooks/useDebounce";
// import NewsModal from "@/components/modals/NewsModal";
// import { NewsItem } from "@/types/api";

const PRIMARY_COLOR = "#34C759";

export default function News() {
  const [selectedTag, setSelectedTag] = useState(0); // Changed to number type
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
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedNews, setSelectedNews] = useState<NewsItem | undefined>(undefined);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  // Memoize query filters to ensure React Query detects changes properly
  const queryFilters = useMemo(
    () => ({
      category_id: selectedTag === 0 ? undefined : selectedTag,
      status: filters.status.length > 0 ? filters.status[0] : undefined,
      moderation_status:
        filters.moderationStatus.length > 0
          ? filters.moderationStatus[0]
          : undefined,
      sort_by: sortDirection,
    }),
    [selectedTag, filters.status, filters.moderationStatus, sortDirection]
  );

  // Fetch news data from API
  const {
    data: newsResponse,
    isLoading,
    error,
  } = useNews(currentPage, pageSize, debouncedSearchQuery, queryFilters);

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

  const newsData = newsResponse?.news || [];
  const pagination = newsResponse?.pagination;

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
        <div className="text-lg text-red-600">Error loading news</div>
      </div>
    );
  }

  // const clickHandler = (newsItem: NewsItem) => {
  //   setSelectedNews(undefined);
  //   setModalOpen(true);
  // };

  return (
    <div className="flex flex-col justify-center">
      <TagFilter
        activeTag={selectedTag}
        onChange={setSelectedTag}
        color={PRIMARY_COLOR}
        section={"News"}
      />
      <div className="mt-5"></div>
      {/* <SubscribeBox /> */}

      <div>
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

      <div className="mt-6 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">News</h2>
      </div>

      <div>
        <div className="grid gap-6 md:grid-cols-3">
          {isLoading
            ? // Show loading state
              [...Array(pageSize)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            : newsData.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  image={newsItem.image || "/pngImages/dummy-img.png"}
                  title={newsItem.headline}
                  tags={newsItem.newsTags.map((tag) => tag.tag.name)}
                  color={PRIMARY_COLOR}
                  time={newsItem.published_date || "Recently"}
                  url={`/news/${newsItem.id}`}
                />
              ))}
        </div>

        {!isLoading && newsData?.length === 0 && (
          <div className="text-center py-8 text-gray-500">No news found!.</div>
        )}
      </div>

      {/* {modalOpen && selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setModalOpen(false)} />
      )} */}
    </div>
  );
}
