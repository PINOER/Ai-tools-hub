import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import ReactSelect from 'react-select';
import { Checkbox } from '@/components/ui/checkbox';
import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CreateToolBasicInfoProps {
  control: any;
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  incomingCategories: { label: string; value: number }[];
  selectPrimaryCategory: { label: string; value: number } | undefined;
  selectedSecondaryCategories: { label: string; value: number }[];
  handleCategoryChange: (newValue: { label: string; value: number } | null, type: 'primary' | 'secondary') => void;
  handleSecondaryCategoriesChange: (newValues: readonly { label: string; value: number }[]) => void;
}

export const CreateToolBasicInfo = ({
  control,
  register,
  errors,
  watch,
  incomingCategories,
  selectPrimaryCategory,
  selectedSecondaryCategories,
  handleCategoryChange,
  handleSecondaryCategoriesChange,
}: CreateToolBasicInfoProps) => {
  const fileLogoInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);

  const avatarLogoFile = watch('avatar');
  const websiteUrl = watch('website_url');

  useEffect(() => {
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
    setIsUrlValid(urlRegex.test(websiteUrl));
  }, [websiteUrl]);

  const handleLogoDivClick = () => {
    fileLogoInputRef.current?.click();
  };

  const verifyUrl = () => {
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className='flex flex-col gap-5 justify-center px-6'>
      <div className='flex flex-col gap-1 justify-center mt-3'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>TOOL LOGO*</p>
        <div className='w-[80px] h-[80px] border border-gray-200 rounded-[10px] bg-[#F2F2F2] flex flex-col justify-center items-center'>
          <Controller
            control={control}
            name='avatar'
            defaultValue={null}
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <input
                  type='file'
                  accept='image/*'
                  ref={fileLogoInputRef}
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
                <div onClick={handleLogoDivClick}>
                  {(avatarUrl || avatarLogoFile) ? (
                    <div className="relative">
                      <img
                        src={avatarUrl || (avatarLogoFile ? (typeof avatarLogoFile === 'string' ? avatarLogoFile : URL.createObjectURL(avatarLogoFile)) : '')}
                        alt='Logo'
                        className='w-20 h-20 object-cover rounded'
                      />

                    </div>
                  ) : (
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
                  )}
                </div>
              </>
            )}
          />
        </div>
        {errors.avatar && (
          <p className='text-red-500 text-sm'>Tool logo is required</p>
        )}

      </div>

      <div className='flex flex-col gap-1 '>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>TOOL NAME *</p>
        <Input
          placeholder='Type'
          {...register('name', {
            required: 'Tool name is required',
          })}
        />
        {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>WEBSITE URL *</p>
        <div className='flex gap-3'>
          <Input
            placeholder='Type'
            className='w-5/6'
            {...register('website_url', {
              required: 'Website URL is required',
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/,
                message: 'Please enter a valid URL (e.g. https://example.com)',
              },
            })}
          />
          <button
            type="button"
            onClick={verifyUrl}
            disabled={!isUrlValid}
            className={`rounded-lg w-1/6 flex items-center justify-center text-white py-1 ${isUrlValid ? 'bg-black cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Verify URL
            <ArrowUpRight className='w-[18px] h-[18px] ml-1' />
            {/* <svg
              width='12'
              height='12'
              viewBox='0 0 12 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='ml-1'
            >
              <path
                d='M2 6L4.5 8.5L10 3'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg> */}
          </button>
        </div>
        {errors.website_url && (
          <p className='text-red-500 text-sm'>{errors.website_url.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>Short Description * (150 characters max)</p>
        <Input
          placeholder='Type'
          {...register('short_description', {
            required: 'Short description is required',
            maxLength: {
              value: 150,
              message: 'Short description cannot exceed 150 characters'
            },
          })}
        />
        {errors.short_description && (
          <p className='text-red-500 text-sm'>{errors.short_description.message}</p>
        )}
      </div>

      <div className='flex gap-4'>
        <div className='flex flex-col gap-1 w-3/6'>
          <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>PRIMARY CATEGORY *</p>
          <Controller
            control={control}
            name='category_id'
            render={({ field }) => (
              <ReactSelect
                options={incomingCategories}
                value={selectPrimaryCategory || null}
                onChange={(newValue) => {
                  console.log("newValue", newValue)
                  handleCategoryChange(newValue, 'primary');
                  field.onChange(newValue);
                }}
                placeholder="Select a primary category"
                styles={{
                  indicatorSeparator: () => ({
                    display: 'none',
                  }),
                }}
              />
            )}
          />
        </div>
        <div className='flex flex-col gap-1 w-3/6'>
          <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>SECONDARY CATEGORIES (MAX 2)</p>
          <ReactSelect
            options={incomingCategories}
            isMulti
            value={selectedSecondaryCategories}
            onChange={handleSecondaryCategoriesChange}
            placeholder="Select up to 2 additional categories"
            styles={{
              indicatorSeparator: () => ({
                display: 'none',
              }),
            }}
          />
        </div>
      </div>


      <div className='flex flex-col gap-1'>
        <div className='border border-[#F2F2F2] flex gap-2 items-center rounded-md w-fit px-2 py-1'>
          <label htmlFor='confirmation' className='font-[inter] font-medium text-[15px] text-[#00000080]'>
            I confirm this tool is not already listed *
          </label>
          <Controller
            control={control}
            name='is_unique'
            rules={{
              required: 'You must confirm this tool is not already listed'
            }}
            render={({ field }) => (
              <Checkbox
                id='confirmation'
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        {errors.is_unique && (
          <p className='text-red-500 text-sm'>{errors.is_unique.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>SEO Meta Title</p>
        <Input placeholder='Type' {...register('seo_meta_title')} />
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>SEO Meta Description</p>
        <Input placeholder='Type' {...register('seo_meta_description')} />
      </div>
    </div>
  );
}; 