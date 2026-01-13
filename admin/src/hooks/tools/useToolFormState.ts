import { useState } from "react";
import { CREATE_TOOL_DIALOG_TABS } from "@/lib/contants";
import type { Tools } from "@/types/tools";

export const useToolFormState = () => {
  const [selectedTab, setSelectedTab] = useState(CREATE_TOOL_DIALOG_TABS.basic_info);
  const [finalToolDetails, setFinalToolDetails] = useState<Omit<Tools, "id">>();
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

  // Role and Industry selections
  const [selectedRoles, setSelectedRoles] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedIndustries, setSelectedIndustries] = useState<
    { label: string; value: string }[]
  >([]);

  return {
    // Tab state
    selectedTab,
    setSelectedTab,
    finalToolDetails,
    setFinalToolDetails,
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

    // Role and Industry state
    selectedRoles,
    setSelectedRoles,
    selectedIndustries,
    setSelectedIndustries,
  };
}; 