import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

export const useCreatePromptForm = (prompt?: any) => {
  const [isFeatured, setIsFeatured] = useState(prompt?.is_featured || false);





  // Get primary category ID from promptCategories array
  const getPrimaryCategoryId = (prompt?: any) => {
    if (!prompt?.promptCategories || prompt.promptCategories.length === 0) return 0;
    return prompt.promptCategories[0]?.category?.id || 0;
  };

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
    setError,
    clearErrors,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: prompt?.title || '',
      url_slug: prompt?.url_slug || '',
      category_id: getPrimaryCategoryId(prompt),
      secondary_category_ids: prompt?.secondary_category_ids || [],
      status: prompt?.status || 'Draft',
      ai_models: prompt?.ai_models || [],
      main_prompt: prompt?.main_prompt || '',
      short_description: prompt?.short_description || '',
      user_guide: prompt?.user_guide || '',
      tags: prompt?.tags || '',
      allow_comments: prompt?.allow_comments ?? true,
      published_date: prompt?.published_date,
      published_time: prompt?.published_time,
      
    },
  });

  // Reset form when prompt changes
  useEffect(() => {
    if (prompt) {
      reset({
        title: prompt.title || '',
        url_slug: prompt.url_slug || '',
        category_id: getPrimaryCategoryId(prompt),
        secondary_category_ids: prompt.secondary_category_ids || [],
        status: prompt.status || 'Draft',
        ai_models: prompt.ai_models || [],
        main_prompt: prompt.main_prompt || '',
        short_description: prompt.short_description || '',
        user_guide: prompt.user_guide || '',
        tags: prompt.tags || '',
        allow_comments: prompt.allow_comments ?? true,
        published_date:  prompt?.published_date,
        published_time: prompt.published_time
      });
      setIsFeatured(prompt.is_featured || false);
    }
  }, [prompt, reset]);

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
    setError,
    clearErrors,
    isFeatured,
    setIsFeatured,
  };
}; 