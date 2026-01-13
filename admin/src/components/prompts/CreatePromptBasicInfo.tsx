import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import ReactSelect from 'react-select';
import { useState } from 'react';

interface CreatePromptBasicInfoProps {
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
  incomingTags: { label: string; value: number }[];
  selectedTags: { label: string; value: number }[];
  setSelectedTags: (tags: { label: string; value: number }[]) => void;
}

export const CreatePromptBasicInfo = ({
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
}: CreatePromptBasicInfoProps) => {
  const [customModelInput, setCustomModelInput] = useState('');

  const predefinedModels = ['GPT-4', 'GPT-3.5', 'Claude', 'Gemini', 'Other'];

  const handleModelToggle = (model: string) => {
    const currentModels = watch('ai_models') || [];
    if (currentModels.includes(model)) {
      setValue('ai_models', currentModels.filter((m: string) => m !== model));
      if (model === 'Other') {
        setCustomModelInput('');
      }
    } else {
      setValue('ai_models', [...currentModels, model]);
    }
  };

  const handleAddCustomModel = () => {
    const currentModels = watch('ai_models') || [];
    if (customModelInput.trim() && !currentModels.includes(customModelInput.trim())) {
      setValue('ai_models', [...currentModels, customModelInput.trim()]);
      setCustomModelInput('');
    }
  };

  const handleRemoveCustomModel = (model: string) => {
    const currentModels = watch('ai_models') || [];
    setValue('ai_models', currentModels.filter((m: string) => m !== model));
  };

  return (
    <div className='flex flex-col gap-5 justify-center px-6'>
      <div className='flex flex-col gap-1 justify-center mt-3'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>PROMPT TITLE*</p>
        <Input
          placeholder="Enter prompt title"
          {...register('title', {
            required: 'Prompt title is required',
            maxLength: {
              value: 100,
              message: 'Title must be less than 100 characters'
            },
          })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>URL SLUG</p>
        <Input
          placeholder="Enter URL slug"
          {...register('url_slug', {
            required: 'URL slug is required',
            maxLength: {
              value: 100,
              message: 'URL slug must be less than 100 characters'
            },
          })}
        />
        {errors.url_slug && <p className="text-red-500 text-sm">{errors.url_slug.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>PRIMARY CATEGORY*</p>
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
            }
          }}
          render={({ field }) => (
            <ReactSelect
              options={incomingCategories}
              value={selectPrimaryCategory}
              onChange={(newValue) => {
                field.onChange(newValue?.value);
                handleCategoryChange(newValue, 'primary');
              }}
              placeholder="Select primary category"
              className="w-full"
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>SECONDARY CATEGORIES (MAX 2)</p>
        <Controller
          control={control}
          name='secondary_category_ids'
          render={({ field }) => (
            <ReactSelect
              options={incomingCategories.filter(cat => !selectPrimaryCategory || cat.value !== selectPrimaryCategory.value)}
              isMulti
              value={selectedSecondaryCategories}
              onChange={(newValues) => {
                field.onChange(newValues.map(v => v.value));
                handleSecondaryCategoriesChange(newValues);
              }}
              placeholder="Select up to 2 additional categories"
              className="w-full"
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.secondary_category_ids && <p className="text-red-500 text-sm">{errors.secondary_category_ids.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>COMPATIBLE AI MODELS*</p>
        <Controller
          control={control}
          name='ai_models'
          rules={{ required: 'At least one AI model is required' }}
          render={({ field }) => (
            <div>
              <div className="flex gap-2 flex-wrap mb-2">
                {predefinedModels.map(model => (
                  <button
                    key={model}
                    type="button"
                    className={`px-3 py-1 rounded-lg border text-sm ${field.value?.includes(model) ? 'bg-[#4D4D4D] text-white' : 'border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D]'}`}
                    onClick={() => handleModelToggle(model)}
                  >
                    {model}
                  </button>
                ))}
              </div>
              {field.value?.map((model: string) => (
                <span key={model} className="px-3 py-1 rounded-lg border text-sm border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D] mr-2 mb-2 inline-block">
                  {model}
                  <button type="button" onClick={() => handleRemoveCustomModel(model)} className="ml-1 text-red-500 text-xs">×</button>
                </span>
              ))}
              <div className="flex gap-2 items-center">
                <Input
                  value={customModelInput}
                  onChange={e => setCustomModelInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleAddCustomModel();
                    }
                  }}
                  placeholder="Add custom model"
                  className="w-full max-w-[200px]"
                />
                <button type="button" onClick={handleAddCustomModel} className="px-3 py-1 rounded-lg border border-[#F2F2F2] bg-[#FFFFFF] text-[#4D4D4D] text-sm">Add</button>
              </div>
            </div>
          )}
        />
        {errors.ai_models && <p className="text-red-500 text-sm">{errors.ai_models.message}</p>}
      </div>

      <div className='flex flex-col gap-1 justify-center'>
        <p className='font-[inter] font-medium text-[14px] text-[#808080]'>TAGS</p>
        <ReactSelect
          options={incomingTags}
          isMulti
          value={selectedTags}
          onChange={(newValues) => setSelectedTags([...newValues])}
          placeholder="Select tags"
          className="w-full"
          classNamePrefix="react-select"
        />
      </div>
    </div>
  );
}; 