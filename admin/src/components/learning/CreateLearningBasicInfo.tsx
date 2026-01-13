import { Input } from '@/components/ui/input';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import Tabs from '@/components/Tabs';
import { useRef, useState} from 'react';
import type { useCreateLearningForm } from '@/hooks/learning/useCreateLearningForm';

const SKILL_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

interface CreateLearningBasicInfoProps
  extends ReturnType<typeof useCreateLearningForm> {
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

export const CreateLearningBasicInfo = ({
  control,
  register,
  errors,
  watch,
  setValue,
  incomingCategories,
  selectPrimaryCategory,
  selectedSecondaryCategories,
  handleCategoryChange,
  handleSecondaryCategoriesChange,
  incomingTags,
  selectedTags,
  setSelectedTags,
}: CreateLearningBasicInfoProps) => {
  const fileImageInputRef = useRef<HTMLInputElement>(null);
  const [image] = useState<string | null>(null);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(
    watch('skill_level') || SKILL_LEVEL_OPTIONS[0]
  );
  const imageFile = watch('image');

  const handleImageDivClick = () => {
    fileImageInputRef.current?.click();
  };

  const handleSkillLevelChange = (level: string) => {
    setSelectedSkillLevel(level);
    setValue('skill_level', level);
  };

  return (
    <div className='flex flex-col gap-5 justify-center p-6'>
      <div className='flex flex-col gap-1'>
        <p>CONTENT TITLE *</p>
        <Input
          placeholder='Type'
          {...register('title', {
            required: 'Title is required',
          })}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className='text-red-500 text-sm'>Required</p>}
      </div>

      <div className='flex flex-col gap-1'>
        <p>URL SLUG</p>
        <Input
          placeholder='Type'
          {...register('url_slug', {
            required: 'URL slug is required',
          })}
          className={errors.url_slug ? 'border-red-500' : ''}
        />
        {errors.url_slug && <p className='text-red-500 text-sm'>Required</p>}
      </div>

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-3/6'>
          <p>PRIMARY CATEGORY</p>
          <Controller
            control={control}
            name='category_id'
            rules={{
              required: 'Primary category is required',
              validate: () => {
                if (
                  !selectPrimaryCategory ||
                  selectPrimaryCategory.value === 0
                ) {
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

        <div className='flex flex-col gap-1 w-3/6'>
          <p>SECONDARY CATEGORIES (MAX 2)</p>
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
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-[#808080]'>SKILL LEVEL *</p>
        <div className='flex items-center gap-2'>
          <Tabs
            options={SKILL_LEVEL_OPTIONS}
            selectedTab={selectedSkillLevel}
            setSelectedTab={handleSkillLevelChange}
            tabClickable
          />
        </div>
        <Controller
          control={control}
          name='skill_level'
          rules={{ required: 'Skill level is required' }}
          render={({ field }) => (
            <input type='hidden' {...field} value={selectedSkillLevel} />
          )}
        />
        {errors.skill_level && <p className='text-red-500 text-sm'>Required</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center mt-3'>
        <p>FEATURED IMAGE*</p>
        <Controller
          control={control}
          name='image'
          defaultValue={null}
          rules={{ required: true }}
          render={({ field }) => (
            <>
              <input
                type='file'
                accept='image/*'
                ref={fileImageInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file);
                  } else {
                    field.onChange(null);
                  }
                }}
              />
              <div onClick={handleImageDivClick}>
                {image || imageFile ? (
                  <div className='relative'>
                    <img
                      src={
                        image ||
                        (imageFile
                          ? typeof imageFile === 'string'
                            ? imageFile
                            : URL.createObjectURL(imageFile)
                          : '')
                      }
                      alt='Learning Image'
                      className='w-[22rem] h-[14rem] object-cover rounded'
                    />
                  </div>
                ) : (
                  <div className='cursor-pointer flex items-center justify-center  w-[22rem] h-[14rem] rounded-xl bg-gray-100'>
                    <svg
                    width='24'
                    height='28'
                    viewBox='0 0 16 20'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='cursor-pointer'
                  >
                    <path
                      d='M2.90265 20C1.9469 20 1.22419 19.7611 0.734513 19.2832C0.244838 18.8054 0 18.0973 0 17.1591V8.55769C0 7.62529 0.244838 6.92016 0.734513 6.44231C1.22419 5.95862 1.9469 5.71678 2.90265 5.71678H5.46903V7.43881H3.00885C2.59587 7.43881 2.28024 7.54662 2.06195 7.76224C1.84956 7.97203 1.74336 8.28963 1.74336 8.71504V17.0105C1.74336 17.4359 1.84956 17.7535 2.06195 17.9633C2.28024 18.1789 2.59587 18.2867 3.00885 18.2867H12.9823C13.3894 18.2867 13.7021 18.1789 13.9204 17.9633C14.1445 17.7535 14.2566 17.4359 14.2566 17.0105V8.71504C14.2566 8.28963 14.1445 7.97203 13.9204 7.76224C13.7021 7.54662 13.3894 7.43881 12.9823 7.43881H10.531V5.71678H13.0973C14.0531 5.71678 14.7758 5.95862 15.2655 6.44231C15.7552 6.92016 16 7.62529 16 8.55769V17.1591C16 18.0915 15.7552 18.7966 15.2655 19.2745C14.7758 19.7582 14.0531 20 13.0973 20H2.90265ZM8 13.0332C7.77581 13.0332 7.58112 12.9545 7.41593 12.7972C7.25664 12.6399 7.17699 12.4534 7.17699 12.2378V3.43531L7.24779 2.13287L6.69027 2.77098L5.45133 4.08217C5.30973 4.23951 5.12684 4.31818 4.90265 4.31818C4.69617 4.31818 4.52212 4.25408 4.38053 4.12587C4.24484 3.99184 4.17699 3.82284 4.17699 3.61888C4.17699 3.4324 4.25074 3.26049 4.39823 3.10315L7.37168 0.27972C7.48378 0.174825 7.58997 0.101981 7.69027 0.0611888C7.79056 0.0203963 7.89381 0 8 0C8.10619 0 8.20944 0.0203963 8.30973 0.0611888C8.41003 0.101981 8.51327 0.174825 8.61947 0.27972L11.5929 3.10315C11.7463 3.26049 11.823 3.4324 11.823 3.61888C11.823 3.82284 11.7493 3.99184 11.6018 4.12587C11.4602 4.25408 11.2891 4.31818 11.0885 4.31818C10.8702 4.31818 10.6873 4.23951 10.5398 4.08217L9.30089 2.77098L8.75221 2.63287L8.82301 3.43531V12.2378C8.82301 12.4534 8.74041 12.6399 8.57522 12.7972C8.41593 12.9545 8.22419 13.0332 8 13.0332Z'
                      fill='#CCCCCC'
                    />
                  </svg>
                  </div>
                )}
              </div>
            </>
          )}
        />
        {errors.image && <p className='text-red-500 text-sm'>Image is Required</p>}
      </div>

      <div className='flex flex-col gap-1'>
        <p>Tags</p>
        <ReactSelect
          options={incomingTags}
          isMulti
          value={selectedTags}
          onChange={(newValues) => {
            if (newValues && newValues.length > 0) {
              setSelectedTags([...newValues]);
            } else {
              setSelectedTags([]);
            }
          }}
          placeholder='Select tags'
          className='w-full'
          classNamePrefix='react-select'
        />
      </div>
    </div>
  );
};
