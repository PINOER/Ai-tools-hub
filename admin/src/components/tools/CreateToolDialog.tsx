import { CREATE_TOOL_DIALOG_TABS } from "@/lib/contants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import ToolDetails from "@/components/tools/ToolDetails";
import { ToolsStatus, type Tools } from "@/types/tools";
import ToolDetailGeneric from "@/components/tools/ToolDetailGeneric";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/DialogContainer";
import Tabs from "@/components/Tabs";
import { CreateToolBasicInfo } from "./CreateToolBasicInfo";
import { CreateToolDetails } from "./CreateToolDetails";
import { CreateToolPricing } from "./CreateToolPricing";
import { useToolCreationData } from "@/hooks/tools/useToolCreationData";
import { useToolFormState } from "@/hooks/tools/useToolFormState";
import { useCreateToolForm } from "@/hooks/tools/useCreateToolForm";
import { useToolSubmission } from "@/hooks/tools/useToolSubmission";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface CreateToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  tool?: Tools | null;
  setSubmissions?: React.Dispatch<React.SetStateAction<any[]>>;
}

const createToolDialogOptions = [
  CREATE_TOOL_DIALOG_TABS.basic_info,
  CREATE_TOOL_DIALOG_TABS.tool_details,
  CREATE_TOOL_DIALOG_TABS.pricing_and_availibility,
  CREATE_TOOL_DIALOG_TABS.review_and_submit,
];

// Component for dialog buttons
const DialogButtons = ({
  selectedTab,
  loading,
  onBackClick,
  onSubmit,
  tool,
}: {
  selectedTab: string;
  loading: boolean;
  onBackClick: () => void;
  onSubmit: () => void;
  tool?: Tools | null;
}) => (

  <div className="flex items-center gap-5 px-6 mb-4">

    <div
      className="w-3/6 text-center border border-[#F2F2F2] rounded-md py-1 cursor-pointer"
      onClick={loading ? undefined : onBackClick}
      style={
        loading
          ? { opacity: 0.6, pointerEvents: "none", cursor: "not-allowed" }
          : {}
      }
      aria-disabled={loading}
    >
      {selectedTab === CREATE_TOOL_DIALOG_TABS.basic_info ? "Cancel" : "Back"}
    </div>
    <button
      type="submit"
      className="w-3/6 text-center rounded-md py-1 flex items-center justify-center text-white bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading && <LoadingSpinner />}
      {selectedTab === CREATE_TOOL_DIALOG_TABS.review_and_submit
        ? loading
          ? "Submitting..."
          : tool ? "Update tool" : "Submit tool"
        : loading
          ? "Loading..."
          : "Next"}
    </button>
  </div>
);

// Component for tab content
const TabContent = ({
  selectedTab,
  dataLoading,
  finalToolDetails,
  isFeatured,
  setIsFeatured,
  formProps,
  categoryProps,
  detailsProps,
  pricingProps,
  selectedTags,
}: {
  selectedTab: string;
  dataLoading: boolean;
  finalToolDetails: any;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
  formProps: any;
  categoryProps: any;
  detailsProps: any;
  pricingProps: any;
  selectedTags: { label: string; value: number }[];
}) => {
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading form data...</span>
      </div>
    );
  }

  switch (selectedTab) {
    case CREATE_TOOL_DIALOG_TABS.basic_info:
      return <CreateToolBasicInfo {...formProps} {...categoryProps} />;

    case CREATE_TOOL_DIALOG_TABS.tool_details:
      return <CreateToolDetails {...formProps} {...detailsProps} />;

    case CREATE_TOOL_DIALOG_TABS.pricing_and_availibility:
      return <CreateToolPricing {...pricingProps} />;

    case CREATE_TOOL_DIALOG_TABS.review_and_submit: {
      // Always ensure current tags are displayed in review
      const toolForReview = {
        ...(finalToolDetails || {}),
        tool_tags: selectedTags.map(tag => ({ tag: { id: tag.value, name: tag.label } }))
      };
      
      return (
        <>
          <ToolDetailGeneric tool={toolForReview!} />
          <ToolDetails
            tool={toolForReview!}
            selectedScreenshots={formProps.getValues().screenshots}
            is_featured={isFeatured}
            onFeaturedChange={setIsFeatured}
          />
        </>
      );
    }

    default:
      return null;
  }
};

export const CreateToolDialog = ({
  open,
  onOpenChange,
  categories,
  tags,
  tool,
  setSubmissions,
}: CreateToolProps) => {
  const {
    transformedCategories,
    transformedTags,
    transformedRoles,
    transformedIndustries,
    isLoading: dataLoading,
  } = useToolCreationData(categories, tags);

  const {
    selectedTab,
    setSelectedTab,
    finalToolDetails,
    setFinalToolDetails,
    loading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
    selectedRoles,
    setSelectedRoles,
    selectedIndustries,
    setSelectedIndustries,
  } = useToolFormState();

  const formProps = useCreateToolForm(tool);
  const { createTool, userHook, isLoading: submissionLoading } = useToolSubmission(setSubmissions, tool);
  
  useEffect(() => {
    setIncomingCategories(transformedCategories);
    
    if (transformedCategories.length > 0 && !selectPrimaryCategory && !tool) {
      const firstCategory = transformedCategories[0];
      setSelectPrimaryCategory({
        label: firstCategory.label,
        value: firstCategory.value,
      });
      
      formProps.setValue('category_id', firstCategory.value);
    }
  }, [transformedCategories, setIncomingCategories, selectPrimaryCategory, tool, formProps]);

  useEffect(() => {
    if (tool) {
      if (tool.tool_categories && tool.tool_categories.length > 0) {
        const primaryCategory = tool.tool_categories[0];
        setSelectPrimaryCategory({
          label: primaryCategory.category.name,
          value: primaryCategory.category.id,
        });

        const secondaryCategories = tool.tool_categories.slice(1).map(cat => ({
          label: cat.category.name,
          value: cat.category.id,
        }));
        setSelectedSecondaryCategories(secondaryCategories);
      }

      // Set tags
      if (tool.tool_tags) {
        const tags = tool.tool_tags.map(tag => ({
          label: tag.tag.name,
          value: tag.tag.id,
        }));
        setSelectedTags(tags);
              }

        // Set roles and industries if they exist
        if (tool.tool_roles) {
          const roles = tool.tool_roles.map((role: { id: number; name: string }) => ({
            label: role.name,
            value: role.id.toString(),
          }));
          setSelectedRoles(roles);
        }

        if (tool.tool_industries) {
          const industries = tool.tool_industries.map((industry: { id: number; name: string }) => ({
            label: industry.name,
            value: industry.id.toString(),
          }));
          setSelectedIndustries(industries);
        }
      }
  }, [tool, setSelectPrimaryCategory, setSelectedSecondaryCategories, setSelectedTags]);

  const handleBackClick = () => {
    if (selectedTab === CREATE_TOOL_DIALOG_TABS.review_and_submit) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.pricing_and_availibility);
      return;
    }

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.pricing_and_availibility) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.tool_details);
      return;
    }

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.tool_details) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    formProps.reset();
  };

  const allRequiredFields = [
    "avatar",
    "name",
    "website_url",
    "short_description",
    "primary_category",
    "is_unique",
    "full_description",
    "features",
    "use_cases",
    "selectedPlatforms",
  ];

  const nextButtonClick = async (formData: any) => {
    const {
      name,
      website_url,
      short_description,
      is_unique,
      seo_meta_title,
      seo_meta_description,
      full_description,
      features,
      use_cases,
      free_plan_details,
      paid_plan_details,
      pricing_model,
      selectedPlatforms,
      freePlanAvailable,
    } = formData;

    const toolData = {
      avatar: formData.avatar || "https://placeholder-avatar.com",
      name,
      website_url,
      short_description,
      tool_categories: [
        selectPrimaryCategory && {
          category: {
            id: selectPrimaryCategory.value!,
            name: selectPrimaryCategory.label!,
            section: "Tool",
            url_slug: selectPrimaryCategory
              .label!.toLowerCase()
              .replace(/\s+/g, "-"),
            description: "",
            display_order: 1,
            seo_title: selectPrimaryCategory.label!,
            parentCategoryId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            parent_category: null,
            items: 0,
          },
        },
        ...selectedSecondaryCategories.map((category) => ({
          category: {
            id: category.value,
            name: category.label,
            section: "Tool",
            url_slug: category.label.toLowerCase().replace(/\s+/g, "-"),
            description: "",
            display_order: 1,
            seo_title: category.label,
            parentCategoryId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            parent_category: null,
            items: 0,
          },
        })),
      ].filter((toolCategory) => toolCategory !== undefined),
      is_unique,
      seo_meta_title,
      seo_meta_description,
      full_description,
      features: features,
      use_cases: use_cases,
      tool_tags: selectedTags.map((tag: { label: string; value: number }) => {
        return { tag: { id: tag.value, name: tag.label } };
      }),
      screenshots: formData.screenshots || [],
      free_plan_details,
      paid_plan_details,
      platform_availability: selectedPlatforms,
      pricing_model,
      free_plan_available: freePlanAvailable === 'Yes',
      approved: tool?.approved || false,
      status: tool?.status || ToolsStatus.Pending,
      user_id: userHook.userId!,
      is_featured: Boolean(formProps.isFeatured),
      category_id: selectPrimaryCategory?.value,
      secondary_category_ids: selectedSecondaryCategories.map(cat => cat.value),
      category:
        (selectPrimaryCategory && {
          id: selectPrimaryCategory?.value,
          name: selectPrimaryCategory?.label,
          section: "Tool",
          url_slug:
            selectPrimaryCategory?.label?.toLowerCase().replace(/\s+/g, "-") ||
            "",
          description: "",
          display_order: 1,
          seo_title: selectPrimaryCategory?.label || "",
          parentCategoryId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          parent_category: null,
          items: 0,
        }) ||
        null,
      social_links: [
        {
          platform: "Twitter",
          url: "https://twitter.com/superai",
        },
      ],
      target_roles: selectedRoles.map((role) => role.value),
      target_industries: selectedIndustries.map((industry) => industry.value),
    };

    setFinalToolDetails(toolData);

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.tool_details);
      return;
    }

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.tool_details) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.pricing_and_availibility);
      return;
    }

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.pricing_and_availibility) {
      setSelectedTab(CREATE_TOOL_DIALOG_TABS.review_and_submit);
      return;
    }

    if (selectedTab === CREATE_TOOL_DIALOG_TABS.review_and_submit) {
      const valid = await formProps.trigger(allRequiredFields as any);
      if (!valid) return;

      const success = await createTool({
        ...formData,
        features: features,
        use_cases: use_cases,
        tool_tags: selectedTags.map(
          (tag: { label: string; value: number }) => tag.label
        ),
        category_id: selectPrimaryCategory?.value,
        secondary_category_ids: selectedSecondaryCategories.map(cat => cat.value),
        tool_role_ids: selectedRoles.map(role => parseInt(role.value)),
        tool_industry_ids: selectedIndustries.map(industry => parseInt(industry.value)),
      });

      if (success) {
        onOpenChange(false);
        resetAll();
      }
      return;
    }
  };

  const handleCategoryChange = (
    newValue: {
      label: string;
      value: number;
    } | null,
    type: "primary" | "secondary"
  ) => {
    if (!newValue) return;

    if (type === "primary") {
      setSelectPrimaryCategory({
        label: newValue.label,
        value: newValue.value,
      });
      setIncomingCategories((prev) =>
        prev.filter((value) => value !== newValue)
      );
      setSelectedSecondaryCategories((prev) =>
        prev.filter((category) => category.value !== newValue.value)
      );
    }
  };

  const handleSecondaryCategoriesChange = (
    newValues: readonly { label: string; value: number }[]
  ) => {
    if (newValues.length > 2) {
      return;
    }
    setSelectedSecondaryCategories([...newValues]);
  };

  const resetAll = () => {
    formProps.reset();
    setSelectedTab(CREATE_TOOL_DIALOG_TABS.basic_info);
    setSelectPrimaryCategory(undefined);
    setSelectedTags([]);
    setSelectedSecondaryCategories([]);
    setSelectedRoles([]);
    setSelectedIndustries([]);
    setIncomingCategories(transformedCategories);
    setFinalToolDetails(undefined);
  };

  const categoryProps = {
    incomingCategories,
    selectPrimaryCategory,
    selectedSecondaryCategories,
    handleCategoryChange,
    handleSecondaryCategoriesChange,
  };

  const detailsProps = {
    incomingTags: transformedTags,
    selectedTags,
    setSelectedTags,
    roles: transformedRoles,
    industries: transformedIndustries,
    selectedRoles,
    selectedIndustries,
    setSelectedRoles,
    setSelectedIndustries,
  };

  const pricingProps = {
    control: formProps.control,
    register: formProps.register,
    errors: formProps.errors,
  };

  return (
    <DialogContainer
      title={tool ? "Edit tool" : "Submit tool"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createToolDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={tool ? true : false}
      />

      <TabContent
        selectedTab={selectedTab}
        dataLoading={dataLoading}
        finalToolDetails={finalToolDetails}
        isFeatured={Boolean(formProps.isFeatured)}
        setIsFeatured={formProps.setIsFeatured}
        formProps={formProps}
        categoryProps={categoryProps}
        detailsProps={detailsProps}
        pricingProps={pricingProps}
        selectedTags={selectedTags}
      />

      <DialogButtons
        selectedTab={selectedTab}
        loading={loading || submissionLoading}
        onBackClick={handleBackClick}
        onSubmit={formProps.handleSubmit(nextButtonClick)}
        tool={tool}
      />
    </DialogContainer>
  );
};
