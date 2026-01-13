import LearningDetailPage from "@/components/learning/LearningDetailPage";
import { getLearningById } from "@/services/learningService";

type Props = {  
    params: Promise<{ id: string }>;
  };

export async function generateMetadata ({ params } : Props) {
    const param = await params;
    const learningId = parseInt(param.id);
    const learning = await getLearningById(learningId);

    if (!learning) {
        return {
            title : "Learning Not Found",
        }
    }

    return {
        title: learning.title,
        description: learning.description,
        openGraph: {
          title: learning.title,
          description: learning.description,
          images: learning.image ? [learning.image] : [],
        },
      };
}

export default function Page () {
    return  <LearningDetailPage />
}