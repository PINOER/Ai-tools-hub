"use client";
import { useState, useMemo } from "react";
import NewsCard from "@/components/cards/NewsCard";
import FilterBar from "@/components/filtersBar";
// import { Article } from "@/services/articlesService";
// import ArticalModal from "@/components/modals/ArticalModal";
import { useArticles } from "@/hooks/queries/useArticlesQuery";
import { useDebounce } from "@/hooks/useDebounce";
import TagFilter from "@/components/Tags";

export default function Articles() {
  const [selectedTag, setSelectedTag] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  // const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  // const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filters, setFilters] = useState<{
    status: string[];
    moderationStatus: string[];
  }>({
    status: [],
    moderationStatus: [],
  });

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

  const {
    data: articlesData,
    isLoading,
    error,
  } = useArticles(currentPage, pageSize, debouncedSearchTerm, queryFilters);

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

  const articles = articlesData?.articles || [];
  const pagination = articlesData?.pagination;

  const filtersData = {
    status: ["Published", "Draft", "Scheduled"],
    moderationStatus: ["Approved", "Rejected", "Pending"],
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading articles</div>
      </div>
    );
  }

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
    setCurrentPage(1);
  };

  const getCurrentRange = () => {
    if (!pagination) return "1–10 of 0";
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, pagination.total);
    return `${start}–${end} of ${pagination.total}`;
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSortChange = (direction: "asc" | "desc") => {
    setSortDirection(direction);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="flex flex-col justify-center">
      <TagFilter
        activeTag={selectedTag}
        onChange={setSelectedTag}
        color="#00C7BE"
        section="Article"
      />
      <div className="mt-5"></div>
      <FilterBar
        onSearch={handleSearch}
        onReset={handleReset}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        currentRange={getCurrentRange()}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        canGoPrev={currentPage > 1}
        filters={filters} // ✅ pass filters object
        filtersData={filtersData}
        onFilterChange={handleFilterChange}
        canGoNext={pagination ? currentPage < pagination.totalPages : false}
        onSortChange={handleSortChange}
        sortDirection={sortDirection}
      />

      <div className="mt-4 mb-2 sm:mb-0 md:mb-0">
        <h2 className="text-xl font-semibold text-gray-800">Articles</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6 sm:mt-3">
        {isLoading
          ? [...Array(pageSize)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          : articles.slice(0, pageSize).map((article, index) => (
              <NewsCard
                key={index}
                image={"/pngImages/dummy-img.png"}
                title={article.headline}
                tags={article.articleTags.map((tag) => tag.tag.name)}
                color="#00C7BE"
                time={article.published_time || "Recently"}
                // onClick={() => {
                //   setModalOpen(true);
                //   setSelectedArticle(article);
                // }}
                url={`/articles/${article.id}`}
              />
            ))}
      </div>

      {!isLoading && articles?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? `No articles found matching "${searchTerm}".`
            : "No articles found."}
        </div>
      )}

      {/* {modalOpen && selectedArticle && <ArticalModal onClose={() => setModalOpen(false)} article={selectedArticle} />} */}
    </div>
  );
}
