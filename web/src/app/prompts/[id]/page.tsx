
import PromptDetailPage from "@/components/prompt/PromptDetailPage";
import { getPromptById } from "@/services/prompt";

type Props = {  
    params: Promise<{ id: string }>;
  };

export async function generateMetadata ({ params } : Props) {
    const param = await params;
    const newsId = parseInt(param.id);
    const prompt = await getPromptById(newsId);

    if (!prompt) {
        return {
            title : "Prompt Not Found",
        }
    }

    return {
        title: prompt.data.title,
        description: prompt.data.short_description,
        openGraph: {
          title: prompt.data.title,
          description: prompt.data.short_description,
        //   images: prompt.data.imageUrl ? [prompt.data.imageUrl] : [],
        },
      };
}

export default function Page () {
    return  <PromptDetailPage />
}