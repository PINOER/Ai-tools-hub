import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/toolUi/textarea';
import Tabs from '@/components/toolUi/Tabs';
import MultiTabs from '@/components/toolUi/MultiTabs';

interface CreateToolPricingProps {
  control: any;
  register: any;
}

const PRICING_MODELS = [
  'Free',
  'Freemium',
  'Paid',
  'PaidOnly',
  'One-time Purchase',
];

const PLATFORM_AVAILIBILITY = [
  'Web',
  'MobileApp',
  'Desktop',
  'BrowserExtension',
  'Api',
];

export const CreateToolPricing = ({
  control,
  register,
}: CreateToolPricingProps) => {
  return (
    <div className='flex flex-col gap-5 justify-center px-6 mt-[20px] overflow-x-auto scrollbar-hide'>
      <div className='flex flex-col gap-1'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>PRICING MODEL *</p>
        <div className='ml-[-25px]'>
        <Controller
          control={control}
          name='pricing_model'
          render={({ field }) => (
            <Tabs
              options={PRICING_MODELS}
              selectedTab={field.value}
              setSelectedTab={field.onChange}
              tabClickable
            />
          )}
          />
          </div>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>FREE PLAN AVAILABLE</p>
        <div className='flex items-center gap-2'>
         <div className='ml-[-25px]'>
         <Controller
            control={control}
            name='freePlanAvailable'
            render={({ field }) => (
              <Tabs
                options={['Yes', 'No']}
                selectedTab={field.value}
                setSelectedTab={field.onChange}
                tabClickable
              />
            )}
          />
         </div>
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>FREE PLAN DETAILS:</p>
        <Textarea
          placeholder='Type'
          {...register('free_plan_details', { required: false })}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-Nunito font-semibold text-[14px] text-[#4D4D4D]'>PAID PLANS</p>
        <Textarea
          placeholder='Type'
          {...register('paid_plan_details', { required: false })}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>PLATFORM AVAILIBILITY</p>
        <div className='flex items-center gap-2'>
          <Controller
            control={control}
            name='selectedPlatforms'
            render={({ field }) => (
              <MultiTabs
                options={PLATFORM_AVAILIBILITY}
                selectedTabs={field.value}
                setSelectedTabs={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}; 