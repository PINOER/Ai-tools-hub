import ArticleDetailPage from "@/components/article/ArticalDetailPage";
import { getArticleById } from "@/services/articlesService";

type Props = {  
    params: Promise<{ id: string }>;
  };

export async function generateMetadata ({ params } : Props) {
    const param = await params;
    const newsId = parseInt(param.id);
    const article = await getArticleById(newsId);

    if (!article) {
        return {
            title : "Article Not Found",
        }
    }

    return {
        title: article.headline,
        description: article.content,
        openGraph: {
          title: article.headline,
          description: article.content,
          images: article.image ? [article.image] : [],
        },
      };
}

export default function Page () {
    return  <ArticleDetailPage />
}