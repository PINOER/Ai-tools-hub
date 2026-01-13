import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateGlossaryForm } from "@/hooks/glossary/useCreateGlossaryForm";

interface CreateGlossaryContentProps extends ReturnType<typeof useCreateGlossaryForm> {
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
}

export const CreateGlossaryContent = ({
  register,
  errors,
}: CreateGlossaryContentProps) => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <Label className="block mb-1 text-[14px] font-medium text-[#4D4D4D]">
          DETAILED DEFINITION
        </Label>
        <Textarea
          {...register("definition")}
          className={`min-h-[180px] ${errors.definition ? "border-red-500" : ""}`}
          placeholder="Type"
        />
        {errors.definition && (
          <span className="text-red-500 text-sm">{errors.definition.message}</span>
        )}
      </div>
    </div>
  );
}; 