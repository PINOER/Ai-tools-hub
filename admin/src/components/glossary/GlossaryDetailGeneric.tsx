import { PersonIcon } from "../icons";
import type { Glossary } from "@/types/glossary";

interface GlossaryDetailGenericProps {
  glossary: Omit<Glossary, "id">;
}

export const GlossaryDetailGeneric = ({ glossary }: GlossaryDetailGenericProps) => {
  return (
    <div className="flex flex-col gap-2 p-6">
      <div className="text-2xl font-normal mb-1">{glossary.term}</div>
      <div className="flex gap-2 mb-2">
      {glossary.glossary_categories?.map((cat: any) => (
          <span key={cat.category.id} className="text-xs text-[#34B1C8] border border-[#F2F2F2] px-2 py-1 rounded-lg">
            {cat.category.name}
          </span>
        ))}
      </div>
      <div className="flex gap-4 text-sm text-[#808080] items-center">
        <span>{glossary.published_date || "May 22, 2025"}</span>
        {glossary.user.username && <div className="flex justify-center items-center gap-4">
          <PersonIcon width={11} height={11} color="#808080" />
          <span className="-ml-3">{glossary.user.username}</span>
        </div>}
      </div>
    </div>
  );
}; 