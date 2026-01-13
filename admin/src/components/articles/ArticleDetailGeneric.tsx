import { PersonIcon } from "../icons";
import type { Article } from "@/types/article";

interface ArticleDetailGenericProps {
  article: Omit<Article, "id">;
}

export const ArticleDetailGeneric = ({ article }: ArticleDetailGenericProps) => {
  console.log(article);
  return (
    <div className="flex flex-col gap-2">
      {article.image && (
        <img 
          src={typeof article.image === 'string' ? article.image : URL.createObjectURL(article.image)} 
          alt="image" 
          className="h-[35vh]"
        />
      )}
      <div className="text-2xl font-normal mb-1">{article.headline}</div>
      <div className="flex gap-2 mb-2">
      {article.articleCategories?.map((cat: any) => (
          <span key={cat.category.id} className="text-xs text-[#34B1C8] border border-[#F2F2F2] px-2 py-1 rounded-lg">
            {cat.category.name}
          </span>
        ))}
      </div>
      <div className="flex gap-4 text-sm text-[#808080] items-center">
        <span>{article.published_date || "May 22, 2025"}</span>
        {article.user.username && <div className="flex justify-center items-center gap-4">
          <PersonIcon width={11} height={11} color="#808080" />
          <span className="-ml-3">{article?.user?.username ?? 'Sarah'}</span>
        </div>}
      </div>
    </div>
  );
}; 