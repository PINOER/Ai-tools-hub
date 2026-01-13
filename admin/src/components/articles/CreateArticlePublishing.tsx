import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { useCreateArticleForm } from "@/hooks/articles/useCreateArticlesForm";
interface CreateArticlePublishingProps {
  control: ReturnType<typeof useCreateArticleForm>["control"];
  register: ReturnType<typeof useCreateArticleForm>["register"];
  errors: any;
}

export const CreateArticlePublishing = ({
  control,
  errors
}: CreateArticlePublishingProps) => {

  return (
    <div className="flex flex-col gap-5 justify-center p-6">
      <div className="flex flex-col gap-1">
        <p className="text-[#808080]">STATUS *</p>
         <Controller
          control={control}
          name='status'
          render={({ field }) => (
            <div className="flex gap-2">
              {[
                { ui: 'Draft', api: 'Draft' },
                { ui: 'Publish Now', api: 'Published' },
                { ui: 'Schedule', api: 'Scheduled' }
              ].map(({ ui, api }) => (
                <button
                  key={ui}
                  type="button"
                  className={`px-3 py-1 rounded-lg border text-sm ${field.value === api ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
                  onClick={() => field.onChange(api)}
                >
                  {ui}
                </button>
              ))}
            </div>
          )}
        />
        {errors?.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
      </div>

              <div className="flex items-center gap-2">
        <div className="flex flex-col gap-4 w-3/6">
          <p>DATE</p>
          <Controller
            control={control}
            name="published_date"
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className="w-full border border-[#E5E5E5] px-2 py-1 rounded-lg"
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1 w-3/6">
          <p>TIME</p>
          <Controller
            control={control}
            name="published_time"
            render={({ field }) => (
              <Input
                {...field}
                type="time"
                className="w-full border border-[#E5E5E5] px-2 py-1 rounded-lg"
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-[#808080]">VISIBILITY</p>
        <div className="flex flex-row items-center gap-4">
          <div className="border border-[#F2F2F2] flex gap-2 items-center rounded-md w-fit px-2 py-1">
          <Controller
            control={control}
            name="featured_on_homepage"
            render={({ field }) => (
              <Checkbox
                id="featuredOnHomepage"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="featuredOnHomepage">Featured on Homepage</label>
        </div>

        <div className="border border-[#F2F2F2] flex gap-2 items-center rounded-md w-fit px-2 py-1">
          <Controller
            control={control}
            name="include_in_newsletter"
            render={({ field }) => (
              <Checkbox
                id="includeInNewsletter"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="includeInNewsletter">Include in Newsletter</label>
        </div>
        
        <div className="border border-[#F2F2F2] flex gap-2 items-center rounded-md w-fit px-2 py-1">
          <Controller
            control={control}
            name="allow_comments"
            render={({ field }) => (
              <Checkbox
                id="allowComments"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label htmlFor="allowComments">Allow Comments</label>
        </div>
        
        </div>
      </div>

      <div className="h-28" />
    </div>
  );
};
