import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { useCreateLearningForm } from "@/hooks/learning/useCreateLearningForm";

interface CreateLearningContentProps
  extends ReturnType<typeof useCreateLearningForm> {
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
}

export const CreateLearningContent = ({
  register,
  errors,
}: CreateLearningContentProps) => {
  return (
    <div className="flex flex-col gap-5 justify-center p-6">
      <div className="flex flex-col gap-1">
        <p>VIDEO SESSION LINK</p>
        <Input
          placeholder="Type"
          {...register("lesson_link", {
            required: "Video link is required",
            pattern: {
              value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
              message: "Please enter a valid URL",
            },
          })}
          className={errors.lesson_link ? "border-red-500" : ""}
        />
        {errors.lesson_link && (
          <p className="text-red-500 text-sm">{errors.lesson_link.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <p>DESCRIPTION (OPTIONAL)</p>
        <Textarea
          placeholder="Type"
          {...register("content")}
          className={`min-h-[180px] ${errors.content ? "border-red-500" : ""}`}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
    </div>
  );
};
