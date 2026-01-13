import type { useCreateArticleForm } from "@/hooks/articles/useCreateArticlesForm";
import { Controller } from "react-hook-form";
import { RichTextEditor } from "../shared";

interface CreateArticleContentProps
  extends ReturnType<typeof useCreateArticleForm> {
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
}

export const CreateArticleContent = ({
  control,
  errors,
}: CreateArticleContentProps) => {
  return (
    <div className="flex flex-col gap-5 justify-center p-6">
      <div className="flex flex-col gap-1">
        <p>ARTICLE CONTENT</p>
        <Controller
          name="content"
          control={control}
          rules={{ required: 'content is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              height={200}
              onChange={field.onChange}
              placeholder="Enter content"
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>
    </div>
  );
};
