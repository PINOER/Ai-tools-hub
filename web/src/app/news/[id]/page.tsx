import NewsDetailPage from "@/components/news/NewsDetailPage";
import { getNewsById } from "@/services/newsService";

type Props = {  
    params: Promise<{ id: string }>;
  };

export async function generateMetadata ({ params } : Props) {
    const param = await params;
    const newsId = parseInt(param.id);
    const news = await getNewsById(newsId);

    if (!news) {
        return {
            title : "News Not Found",
        }
    }

    return {
        title: news.headline,
        description: news.content,
        openGraph: {
          title: news.headline,
          description: news.content,
          images: news.user.avatar ? [news.user.avatar] : [],
        },
      };
}

export default function Page () {
    return  <NewsDetailPage />
}