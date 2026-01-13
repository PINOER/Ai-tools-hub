import GlossaryDetailPage from "@/components/glossary/GlossaryDetailPage";
import { getGlossaryById } from "@/services/glossary";

type Props = {  
    params: Promise<{ id: string }>;
  };

export async function generateMetadata ({ params } : Props) {
    const param = await params;
    const newsId = parseInt(param.id);
    const glossary = await getGlossaryById(newsId);

    if (!glossary) {
        return {
            title : "Glossary Term Not Found",
        }
    }

    return {
        title: glossary.data.term,
        description: glossary.data.definition,
        openGraph: {
          title: glossary.data.term,
          description: glossary.data.definition,
          images: glossary.data.user.avatar ? [glossary.data.user.avatar] : [],
        },
      };
}

export default function Page () {
    return  <GlossaryDetailPage />
}