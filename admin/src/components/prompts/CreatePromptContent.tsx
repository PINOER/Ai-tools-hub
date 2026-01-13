import { Controller } from 'react-hook-form';
import { RichTextEditor } from '@/components/shared/RichTextEditor';

interface CreatePromptContentProps {
  control: any;
  errors: any;
}

export const CreatePromptContent = ({
  control,
  errors,
}: CreatePromptContentProps) => {
  return (
    <div className='flex flex-col gap-5 justify-center px-6'>
      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>SHORT DESCRIPTION*</p>
        <Controller
          name="short_description"
          control={control}
          rules={{ required: 'Short description is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              height={200}
              onChange={field.onChange}
              placeholder="Enter short description"
            />
          )}
        />
        {errors.short_description && <p className="text-red-500 text-sm">{errors.short_description.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>MAIN PROMPT*</p>
        <Controller
          name="main_prompt"
          control={control}
          rules={{ required: 'Main prompt is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              height={200}
              onChange={field.onChange}
              placeholder="Enter main prompt"
              className="min-h-[180px]"
            />
          )}
        />
        {errors.main_prompt && <p className="text-red-500 text-sm">{errors.main_prompt.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>HOW TO USE*</p>
        <Controller
          name="user_guide"
          control={control}
          rules={{ required: 'User guide is required' }}
          render={({ field }) => (
            <RichTextEditor
              value={field.value || ''}
              height={200}
              onChange={field.onChange}
              placeholder="Enter user guide"
            />
          )}
        />
        {errors.user_guide && <p className="text-red-500 text-sm">{errors.user_guide.message}</p>}
      </div>
    </div>
  );
}; 