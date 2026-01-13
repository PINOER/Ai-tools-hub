import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { CreateToolForm, Tools } from "@/types/tools";
import { PricingModel, PlatformAvailability } from "@/types/tools";

const PRICING_MODELS = [
  PricingModel.Free,
  PricingModel.Freemium,
  PricingModel.Paid,
  PricingModel.PaidOnly,
  PricingModel.OneTimePurchase,
];

export const useCreateToolForm = (tool?: Tools | null) => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
    watch,
    trigger,
    setValue,
  } = useForm<CreateToolForm>({
    defaultValues: {
      avatar: null,
      name: "",
      website_url: "",
      short_description: "",
      is_unique: false,
      seo_meta_title: "",
      seo_meta_description: "",
      full_description: "",
      features: "",
      use_cases: "",
      tool_tags: [],
      screenshots: [],
      pricing_model: PRICING_MODELS[0] as any,
      is_featured: false,
      selectedPlatforms: [PlatformAvailability.Web], // Default to Web platform
      freePlanAvailable: 'No',
      free_plan_details: "",
      paid_plan_details: "",
      category_id: null,
    },
  });

  const isFeatured = watch("is_featured");
  const setIsFeatured = (value: boolean) => setValue("is_featured", value);

  useEffect(() => {
    if (tool) {
      setValue('name', tool.name);
      setValue('website_url', tool.website_url);
      setValue('short_description', tool.short_description);
      setValue('full_description', tool.full_description);
      setValue('features', tool.features?.join('\n') || '');
      setValue('use_cases', tool.use_cases?.join('\n') || '');
      setValue('avatar', tool.avatar);
      setValue('screenshots', tool.screenshots || []);
      setValue('pricing_model', tool.pricing_model as any || PRICING_MODELS[0]);
      setValue('is_featured', tool.is_featured);
      setValue('is_unique', tool.is_unique);
      setValue('seo_meta_title', tool.seo_meta_title || '');
      setValue('seo_meta_description', tool.seo_meta_description || '');
      setValue('free_plan_details', tool.free_plan_details || '');
      setValue('paid_plan_details', tool.paid_plan_details || '');
      setValue('freePlanAvailable', tool.freePlanAvailable ? 'Yes' : 'No');
      setValue('selectedPlatforms', tool.platform_availability?.map(p => p.toString()) || []);
    }
  }, [tool, setValue]);

  return {
    register,
    control,
    handleSubmit,
    getValues,
    errors,
    reset,
    watch,
    trigger,
    setValue,
    isFeatured,
    setIsFeatured,
  };
}; 