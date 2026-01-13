import NewsCard from "../cards/NewsCard";
import { NewsCardProps } from "@/types/components";

interface RelatedContentProps {
  cards: NewsCardProps[];
  name? : string;
}

export function RelatedContent({ cards, name }: RelatedContentProps) {
   return (
    <section>
    <h3 className="font-semibold text-[15px] mb-1 text-[#00000033] uppercase">Related Content</h3>
    <div className="mx-auto mt-2">
      <div className="grid gap-6 md:grid-cols-3">
        {cards?.map((card, index) => (
          <NewsCard
            key={index}
            image={card.image}
            title={card.title}
            tags={card.tags}
            color={"#34C759"}
            time={card.time}
            url={`/${name}/${card.id}`}
          />
        ))}
      </div>
    </div>
  </section>
   )
}