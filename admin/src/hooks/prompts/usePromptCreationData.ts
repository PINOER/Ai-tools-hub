import { useState, useEffect } from 'react';
import type { Category } from '@/types/categories';
import type { Tag } from '@/types/tag';

export const usePromptCreationData = (categories: Category[], tags: Tag[]) => {
  const [transformedCategories, setTransformedCategories] = useState<{ label: string; value: number }[]>([]);
  const [transformedTags, setTransformedTags] = useState<{ label: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const transformData = () => {
      // Transform categories
      const transformedCats = categories
        .filter(cat => cat.section === 'Prompt')
        .map(cat => ({
          label: cat.name,
          value: cat.id,
        }));

      // Transform tags
      const transformedTagsData = tags.map(tag => ({
        label: tag.name,
        value: tag.id,
      }));

      setTransformedCategories(transformedCats);
      setTransformedTags(transformedTagsData);
      setIsLoading(false);
    };

    transformData();
  }, [categories, tags]);

  return {
    transformedCategories,
    transformedTags,
    isLoading,
  };
}; 