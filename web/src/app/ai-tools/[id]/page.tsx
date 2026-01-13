import type { Metadata } from "next";
import { getToolById } from "@/services/tools";
import ToolDetailPage from "@/components/tools/ToolDetailPage"; // client component

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const param = await params;
  const toolId = parseInt(param.id);
  const tool = await getToolById(toolId);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "No details available for this tool.",
    };
  }

  return {
    title: tool.name,
    description: tool.short_description,
    openGraph: {
      title: tool.name,
      description: tool.short_description,
      images: tool.avatar ? [tool.avatar] : [],
    },
  };
}

export default function Page() {
  return <ToolDetailPage />;
}
