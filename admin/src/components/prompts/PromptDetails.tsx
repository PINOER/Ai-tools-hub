interface PromptDetailsProps {
  prompt: any;
}

export const PromptDetails = ({ prompt }: PromptDetailsProps) => {
  if (!prompt) return null;

  return (
    <div className="flex flex-col gap-4 px-6">
      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-1 mt-2">SHORT DESCRIPTION</div>
        <div className="mb-4 text-[#222] text-sm">{prompt.short_description}</div>
      </div>
      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">MAIN PROMPT</div>
        <div className="border rounded-lg p-4 text-[15px] whitespace-pre-wrap">{prompt.main_prompt}</div>
      </div>
      <div>
        <div className="text-[15px] text-[#00000033] font-medium mb-2">HOW TO USE</div>
        <div className="text-[#222] text-sm">{prompt.user_guide}</div>
      </div>
    </div>
  );
}; 