// components/FeaturedArticleSection.jsx
import NewsCard from "./cards/NewsCard";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { HomeArticle } from "@/types/components";
import { NewsCardGridSkeleton } from "./skeletonCards/NewsCardSkeleton";

interface FeaturedArticleSectionProps {
  articles: HomeArticle[];
  isLoading: boolean;
}

export default function FeaturedArticleSection({
  articles,
  isLoading,
}: FeaturedArticleSectionProps) {
  // Transform API data to match NewsCard props
  const transformedArticles = articles.map((item) => ({
    id: item.id,
    image: "/pngImages/dummy-img.png",
    title: item.headline,
    tags: item.articleCategories?.map((cat) => cat.category.name) || [],
    time: "3 min", // API doesn't provide time, using default
  }));

  return (
    <section>
      <SectionHeader
        title="Featured Article"
        color="#00C7BE"
        icon={
          <Image
            src="/article-icon.svg"
            alt="Article Icon"
            width={32}
            height={32}
            className="inline-block"
          />
        }
        viewAllHref={"/articles"}
      />
      {articles.length === 0 && (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">No articles found</p>
        </div>
      )}
      <div className="mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {isLoading
            ? [1, 2, 3].map((article) => <NewsCardGridSkeleton key={article} />)
            : transformedArticles.map((card, index) => (
                <NewsCard
                  key={index}
                  image={card.image}
                  title={card.title}
                  tags={card.tags}
                  color={"#00C7BE"}
                  time={card.time}
                  url={`/articles/${card.id}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
