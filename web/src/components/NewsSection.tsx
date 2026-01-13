// components/NewsSection.jsx
import NewsCard from "./cards/NewsCard";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { HomeNews } from "@/types/components";
import { NewsCardGridSkeleton } from "./skeletonCards/NewsCardSkeleton";

interface NewsSectionProps {
  news: HomeNews[];
  isLoading: boolean;
}

export default function NewsSection({ news, isLoading }: NewsSectionProps) {
  // Transform API data to match NewsCard props
  const transformedNews = news.map((item) => ({
    id: item.id,
    image: "/pngImages/dummy-img.png",
    title: item.headline,
    tags: item.newsCategories?.map((cat) => cat.category.name) || [],
    time: "3 min", // API doesn't provide time, using default
  }));

  return (
    <section className="py-10">
      <SectionHeader
        title="News"
        color="#34C759"
        icon={
          <Image
            src="/news-icon.svg"
            alt="News Icon"
            width={32}
            height={32}
            className="inline-block"
          />
        }
        viewAllHref={"/news"}
      />
      {news.length === 0 && (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">No news found</p>
        </div>
      )}
      <div className="mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {isLoading
            ? [1, 2, 3].map((news) => <NewsCardGridSkeleton key={news} />)
            : transformedNews.map((card, index) => (
                <NewsCard
                  key={index}
                  image={card.image}
                  title={card.title}
                  tags={card.tags}
                  color={"#34C759"}
                  time={card.time}
                  url={`/news/${card.id}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
