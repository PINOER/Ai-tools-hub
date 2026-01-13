import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller } from 'react-hook-form';
import { useCreateGlossaryForm } from "@/hooks/glossary/useCreateGlossaryForm";

interface CreateGlossaryPublishingProps {
  control: ReturnType<typeof useCreateGlossaryForm>["control"];
  errors: any;
}

export const CreateGlossaryPublishing = ({
  control,
  errors
}: CreateGlossaryPublishingProps) => {
  return (
    <div className='flex flex-col gap-5 justify-center px-6'>
      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>STATUS*</p>
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

      <div className='flex gap-4'>
        <div className='flex-1'>
          <p className='font-[inter] font-medium text-[14px] text-[#808080] mb-1'>DATE</p>
          <Controller
            control={control}
            name='published_date'
            render={({ field }) => (
              <Input
                {...field}
                type="date"
                className={errors?.published_date ? 'border-red-500' : ''}
              />
            )}
          />
          {errors?.published_date && <p className="text-red-500 text-xs mt-1">{errors.published_date.message}</p>}
        </div>
        <div className='flex-1'>
          <p className='font-[inter] font-medium text-[14px] text-[#808080] mb-1'>TIME</p>
          <Controller
            control={control}
            name='published_time'
            render={({ field }) => (
              <Input
                {...field}
                type="time"
                className={errors?.published_time ? 'border-red-500' : ''}
              />
            )}
          />
          {errors?.published_time && <p className="text-red-500 text-xs mt-1">{errors.published_time.message}</p>}
        </div>
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>VISIBILITY</p>
        <Controller
          control={control}
          name='allow_comments'
          render={({ field }) => (
            <div className="flex items-center gap-2 mt-2">
              <Checkbox
                id="allowComments"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor="allowComments">Allow Comments</label>
            </div>
          )}
        />
        {errors?.allow_comments && <p className="text-red-500 text-xs mt-1">{errors.allow_comments.message}</p>}
      </div>
    </div>
  );
}; 