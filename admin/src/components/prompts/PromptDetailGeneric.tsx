interface PromptDetailGenericProps {
  prompt: any;
}

export const PromptDetailGeneric = ({ prompt }: PromptDetailGenericProps) => {
  if (!prompt) return null;

  return (
    <div className="flex flex-col gap-2 px-6">
      <span className="text-4xl">🔍</span>
      <div className="text-2xl font-normal mb-1">{prompt.title}</div>
      <div className="flex gap-2 mb-2">
        {prompt.promptCategories?.map((cat: any) => (
          <span key={cat.category.id} className="text-xs text-[#34B1C8] border border-[#F2F2F2] px-2 py-1 rounded-lg">
            {cat.category.name}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-2">
        {prompt.ai_models?.map((model: string) => (
          <span key={model} className="text-[12px] border border-[#F2F2F2] px-2 py-1 rounded-lg text-[#4D4D4D] bg-white">
            {model}
          </span>
        ))}
      </div>
      <div className="flex gap-4 text-sm text-[#808080] items-center">
        <span>{prompt.published_date || 'May 22, 2025'}</span>
        <div className="flex justify-center items-center gap-4">
          <span className="-ml-3">Dr. Research Expert</span>
        </div>
      </div>
    </div>
  );
}; 