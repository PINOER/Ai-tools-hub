import { useState } from "react";
import { CREATE_GLOSSARY_DIALOG_TABS } from "@/lib/contants";

export const useGlossaryFormState = () => {
  const [selectedTab, setSelectedTab] = useState(CREATE_GLOSSARY_DIALOG_TABS.basic_info);
  const [finalGlossaryDetails, setFinalGlossaryDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Category selections
  const [selectPrimaryCategory, setSelectPrimaryCategory] = useState<{
    label: string;
    value: number;
  }>();
  const [selectedSecondaryCategories, setSelectedSecondaryCategories] = useState<
    { label: string; value: number }[]
  >([]);
  const [incomingCategories, setIncomingCategories] = useState<
    { label: string; value: number }[]
  >([]);

  // Tag selections
  const [selectedTags, setSelectedTags] = useState<
    { label: string; value: number }[]
  >([]);

  return {
    // Tab state
    selectedTab,
    setSelectedTab,
    finalGlossaryDetails,
    setFinalGlossaryDetails,
    loading,
    setLoading,

    // Category state
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,

    // Tag state
    selectedTags,
    setSelectedTags,
  };
}; 