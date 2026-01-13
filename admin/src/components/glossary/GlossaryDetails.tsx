import type { Glossary } from "@/types/glossary";

interface GlossaryDetailsProps {
  glossary: Omit<Glossary, "id">;
}

export const GlossaryDetails = ({ glossary }: GlossaryDetailsProps) => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">
          DETAILED DEFINITION
        </div>
        <div className="border rounded-lg p-4 text-[15px] whitespace-pre-wrap">
          {glossary.definition}
        </div>
      </div>

      {glossary.glossary_tags && glossary.glossary_tags.length > 0 && (
        <div>
          <div className="text-md text-[#00000033] font-medium mb-3">TAGS</div>
          <div className="flex gap-2 items-center justify-start">
            {glossary.glossary_tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs border border-[#F2F2F2] bg-white px-2 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">
          STATUS
        </div>
        <div className="text-[15px]">
          {glossary.status}
        </div>
      </div>

      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">
          FEATURED
        </div>
        <div className="text-[15px]">
          {glossary.is_featured ? "Yes" : "No"}
        </div>
      </div>

      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">
          ALLOW COMMENTS
        </div>
        <div className="text-[15px]">
          {glossary.allow_comments ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
}; 