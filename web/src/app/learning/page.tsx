"use client";
import { useState } from "react";
import FilterBar from "@/components/filtersBar";
// import LearningModal from "@/components/modals/LearningModal";
import { useLearningQuery } from "@/hooks/queries/useLearningQuery";
// import { LearningItem } from "@/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import TagFilter from "@/components/Tags";
import Image from "next/image";
import Link from "next/link";

export default function Learning() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTagId, setSelectedTagId] = useState(0);
  const [filters, setFilters] = useState<{
    status: string[];
    moderationStatus: string[];
  }>({
    status: [],
    moderationStatus: [],
  });
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedLearning, setSelectedLearning] = useState<LearningItem | null>(
  //   null
  // );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const debouncedSearchQuery = useDebounce(searchTerm, 500);

  const {
    data: learningData,
    isLoading,
    error,
  } = useLearningQuery(currentPage, pageSize, debouncedSearchQuery, {
    category: selectedTagId === 0 ? undefined : selectedTagId,
    status: filters.status.length > 0 ? filters.status[0] : undefined,
    moderation_status:
      filters.moderationStatus.length > 0
        ? filters.moderationStatus[0]
        : undefined,
    sort_by: sortDirection,
  });

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

  const learning = learningData?.learnings || [];
  const pagination = learningData?.pagination;

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading learning</div>
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
        activeTag={selectedTagId}
        onChange={setSelectedTagId}
        color="#5856D6"
        section="Learning"
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
        canGoNext={pagination ? currentPage < pagination.totalPages : false}
        filters={filters} // ✅ pass filters object
        filtersData={filtersData}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        sortDirection={sortDirection}
      />

      <div className="mt-4 mb-2">
        <h2 className="text-xl font-semibold text-gray-800">Learning</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        {isLoading
          ? [...Array(pageSize)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          : learning.slice(0, pageSize).map((item, index) => (
              <Link href={`/learning/${item.id}`} key={index}>
                <div
                  key={index}
                  className="bg-white cursor-pointer rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  // onClick={() => {
                  //   setModalOpen(true);
                  //   setSelectedLearning(item);
                  // }}
                >
                  <Image
                    src={"/pngImages/dummy-img.png"}
                    alt={item.title || "Learning item"}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                    // unoptimized={!item.image || item.image.startsWith('http')}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                      <span>{item.published_time || "Recently"}</span>
                      {item.skill_level && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {item.skill_level}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.learningTags?.map((tag: any, tagIndex: number) => {
                        const tagName =
                          typeof tag === "string"
                            ? tag
                            : tag?.name || tag?.tag?.name || "Unknown";
                        return (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {!isLoading && learning?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? `No learning content found matching "${searchTerm}".`
            : "No learning content found."}
        </div>
      )}

      {/* {modalOpen && selectedLearning && (
        <LearningModal
          learning={selectedLearning}
          onClose={() => setModalOpen(false)}
        />
      )} */}
    </div>
  );
}
