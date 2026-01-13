"use client";
import { useState, useMemo, Suspense } from "react";
import AiToolsSection from "@/components/AiToolsSection";
import NewsSection from "@/components/NewsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import TagFilter from "@/components/Tags";
import { useHomeQuery } from "@/hooks/queries/useHomeQuery";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

function HomeContent() {
  const [selectedTag, setSelectedTag] = useState(0);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  // Memoize query params to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      resources: "News,Article,Tool",
      category: selectedTag,
      limit: 10,
      search: searchTerm,
    }),
    [selectedTag, searchTerm]
  );

  const { data: homeData, isLoading, error } = useHomeQuery(queryParams);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-3">
      <TagFilter
        activeTag={selectedTag}
        onChange={setSelectedTag}
        color="#4D4D4D"
      />

      {/* Show results count when searching */}
      {searchTerm && (
        <div className="mt-4 mb-2 text-sm text-gray-600">
          Showing results for &quot;{searchTerm}&quot;
        </div>
      )}

      {
        <AiToolsSection
          tools={homeData?.data.tools || []}
          isLoading={isLoading}
        />
      }
      <NewsSection news={homeData?.data.news || []} isLoading={isLoading} />
      <FeaturedArticleSection
        articles={homeData?.data.articles || []}
        isLoading={isLoading}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
