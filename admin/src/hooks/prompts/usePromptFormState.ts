import { useState } from 'react';
import { CREATE_PROMPT_DIALOG_TABS } from '@/lib/contants';

export const usePromptFormState = () => {
  const [selectedTab, setSelectedTab] = useState(CREATE_PROMPT_DIALOG_TABS.basic_info);
  const [finalPromptDetails, setFinalPromptDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectPrimaryCategory, setSelectPrimaryCategory] = useState<{ label: string; value: number } | undefined>();
  const [selectedSecondaryCategories, setSelectedSecondaryCategories] = useState<{ label: string; value: number }[]>([]);
  const [incomingCategories, setIncomingCategories] = useState<{ label: string; value: number }[]>([]);
  const [selectedTags, setSelectedTags] = useState<{ label: string; value: number }[]>([]);

  return {
    selectedTab,
    setSelectedTab,
    finalPromptDetails,
    setFinalPromptDetails,
    loading,
    setLoading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
  };
}; 