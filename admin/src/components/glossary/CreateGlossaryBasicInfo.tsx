import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { Label } from '@/components/ui/label';
import { useCreateGlossaryForm } from '@/hooks/glossary/useCreateGlossaryForm';

interface CreateGlossaryBasicInfoProps
  extends ReturnType<typeof useCreateGlossaryForm> {
  control: any;
  incomingCategories: { label: string; value: number }[];
  selectPrimaryCategory?: { label: string; value: number };
  selectedSecondaryCategories: { label: string; value: number }[];
  handleCategoryChange: (
    newValue: { label: string; value: number } | null,
    type: 'primary' | 'secondary'
  ) => void;
  handleSecondaryCategoriesChange: (
    newValues: readonly { label: string; value: number }[]
  ) => void;
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
}

export const CreateGlossaryBasicInfo = ({
  control,
  register,
  errors,
  incomingCategories,
  selectPrimaryCategory,
  selectedSecondaryCategories,
  handleCategoryChange,
  handleSecondaryCategoriesChange,
  incomingTags,
  selectedTags,
  setSelectedTags,
}: CreateGlossaryBasicInfoProps) => {
  return (
    <div className='flex flex-col gap-4 p-6'>
      <div>
        <Label className='block mb-1 text-[14px] font-medium text-[#4D4D4D]'>
          TERM *
        </Label>
        <Input
          {...register('term')}
          placeholder='Type'
          className={errors.term ? 'border-red-500' : ''}
        />
        {errors.term && (
          <span className='text-red-500 text-sm'>{errors.term.message}</span>
        )}
      </div>

      <div>
        <Label className='block mb-1 text-[14px] font-medium text-[#4D4D4D]'>
          URL SLUG
        </Label>
        <Input
          {...register('url_slug')}
          placeholder='Type'
          className={errors.url_slug ? 'border-red-500' : ''}
        />
        {errors.url_slug && (
          <span className='text-red-500 text-sm'>
            {errors.url_slug.message}
          </span>
        )}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>
          PRIMARY CATEGORY*
        </p>
        <Controller
          control={control}
          name='category_id'
          rules={{
            required: 'Primary category is required',
            validate: () => {
              if (!selectPrimaryCategory || selectPrimaryCategory.value === 0) {
                return 'Primary category is required';
              }
              return true;
            },
          }}
          render={({ field }) => (
            <ReactSelect
              options={incomingCategories}
              value={selectPrimaryCategory}
              onChange={(newValue) => {
                field.onChange(newValue?.value);
                handleCategoryChange(newValue, 'primary');
              }}
              placeholder='Select primary category'
              className='w-full'
              classNamePrefix='react-select'
            />
          )}
        />
        {errors.category_id && (
          <p className='text-red-500 text-sm'>{errors.category_id.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>
          SECONDARY CATEGORIES (MAX 2)
        </p>
        <Controller
          control={control}
          name='secondary_category_ids'
          render={({ field }) => (
            <ReactSelect
              options={incomingCategories.filter(
                (cat) =>
                  !selectPrimaryCategory ||
                  cat.value !== selectPrimaryCategory.value
              )}
              isMulti
              value={selectedSecondaryCategories}
              onChange={(newValues) => {
                field.onChange(newValues.map((v) => v.value));
                handleSecondaryCategoriesChange(newValues);
              }}
              placeholder='Select up to 2 additional categories'
              className='w-full'
              classNamePrefix='react-select'
            />
          )}
        />
        {errors.secondary_category_ids && (
          <p className='text-red-500 text-sm'>
            {errors.secondary_category_ids.message}
          </p>
        )}
      </div>

      <div>
        <Label className='block mb-1 text-[14px] font-medium text-[#4D4D4D]'>
          TAGS
        </Label>
        <select
          multiple
          className='w-full p-2 border border-gray-300 rounded-md'
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(
              (option) => ({
                label: option.text,
                value: Number(option.value),
              })
            );
            setSelectedTags(selectedOptions);
          }}
          value={selectedTags.map((tag) => tag.value.toString())}
        >
          {incomingTags.map((tag) => (
            <option key={tag.value} value={tag.value}>
              {tag.label}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <Controller
          control={control}
          name='is_featured'
          render={({ field }) => (
            <div className='flex items-center gap-2 mt-2'>
              <Checkbox
                id='is_featured'
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <label htmlFor='is_featured'>Featured</label>
            </div>
          )}
        />
        {errors?.is_featured && (
          <p className='text-red-500 text-xs mt-1'>
            {errors.is_featured.message}
          </p>
        )}
      </div>
    </div>
  );
};
