import { Controller } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import Tabs from '@/components/Tabs';
import MultiTabs from '@/components/MultiTabs';
import { PricingModel, PlatformAvailability } from '@/types/tools';

interface CreateToolPricingProps {
  control: any;
  register: any;
  errors: any;
}

const PRICING_MODELS = [
  PricingModel.Free,
  PricingModel.Freemium,
  PricingModel.Paid,
  PricingModel.PaidOnly,
  PricingModel.OneTimePurchase,
];

const PLATFORM_AVAILIBILITY = [
  PlatformAvailability.Web,
  PlatformAvailability.MobileApp,
  PlatformAvailability.Desktop,
  PlatformAvailability.BrowserExtension,
  PlatformAvailability.Api,
];

export const CreateToolPricing = ({
  control,
  register,
  errors,
}: CreateToolPricingProps) => {
  return (
    <div className='flex flex-col gap-5 justify-center px-6 mt-[40px]'>
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
                tabClickable={true}
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
                  tabClickable={true}
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
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>PLATFORM AVAILIBILITY *</p>
        <div className='flex items-center gap-2'>
          <Controller
            control={control}
            name='selectedPlatforms'
            rules={{ 
              required: 'At least one platform must be selected',
              validate: (value) => value && value.length > 0 || 'At least one platform must be selected'
            }}
            render={({ field }) => (
              <MultiTabs
                options={PLATFORM_AVAILIBILITY}
                selectedTabs={field.value}
                setSelectedTabs={field.onChange}
              />
            )}
          />
        </div>
        {errors?.selectedPlatforms && (
          <p className="text-red-500 text-sm mt-1">
            {errors.selectedPlatforms.message}
          </p>
        )}
      </div>
    </div>
  );
};