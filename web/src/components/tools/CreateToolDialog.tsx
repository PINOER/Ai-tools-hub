import { CREATE_TOOL_DIALOG_TABS } from "@/utils/constants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import ToolDetails from "@/components/tools/ToolDetails";
import { ToolsStatus, type Tools } from "@/types/tools";
import ToolDetailGeneric from "@/components/tools/ToolDetailGeneric";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/toolUi/DialogContainer";
import Tabs from "@/components/toolUi/Tabs";
import { CreateToolBasicInfo } from "./CreateToolBasicInfo";
import { CreateToolDetails } from "./CreateToolDetails";
import { CreateToolPricing } from "./CreateToolPricing";
import { useToolFormState } from "@/hooks/tools/useToolFormState";
import { useCreateToolForm } from "@/hooks/tools/useCreateToolForm";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useToolSubmission } from "@/hooks/tools/useToolSubmission";

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
  <div className="flex flex-col md:flex-row items-center gap-5 px-6 mb-4">
    <div
      className="w-full md:w-3/6 text-center border border-[#F2F2F2] rounded-md py-1 cursor-pointer order-2 md:order-1"
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
      className="w-full md:w-3/6 text-center rounded-md py-1 flex items-center justify-center text-white bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed order-1 md:order-2"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading && <LoadingSpinner />}
      {selectedTab === CREATE_TOOL_DIALOG_TABS.review_and_submit
        ? loading
          ? "Submitting..."
          : tool
          ? "Update tool"
          : "Submit tool"
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

    case CREATE_TOOL_DIALOG_TABS.review_and_submit:
      return (
        <>
          <ToolDetailGeneric tool={finalToolDetails!} />
          <ToolDetails
            tool={finalToolDetails!}
            selectedScreenshots={formProps.getValues().screenshots}
            is_featured={isFeatured}
            onFeaturedChange={setIsFeatured}
          />
        </>
      );

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
}: CreateToolProps) => {
  // Static data instead of API calls
  const transformedCategories =
    categories?.map((category) => ({
      label: category.name,
      value: category.id,
    })) || [];

  const transformedTags =
    tags?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    })) || [];

  const transformedRoles = [
    { label: "Developer", value: 1 },
    { label: "Designer", value: 2 },
    { label: "Product Manager", value: 3 },
    { label: "Marketing", value: 4 },
    { label: "Sales", value: 5 },
  ];

  const transformedIndustries = [
    { label: "Technology", value: 1 },
    { label: "Healthcare", value: 2 },
    { label: "Finance", value: 3 },
    { label: "Education", value: 4 },
    { label: "Retail", value: 5 },
  ];

  const dataLoading = false; // No loading state needed for static data

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
  // Mock submission data instead of API calls
  const {
    createTool,
    userHook,
    isLoading: submissionLoading,
  } = useToolSubmission();

  useEffect(() => {
    setIncomingCategories(transformedCategories);
  }, []);

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
    "full_description",
    "features",
    "use_cases",
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
      features: features.split("\n").filter((item: string) => item !== ""),
      use_cases: use_cases.split("\n").filter((item: string) => item !== ""),
      tool_tags: selectedTags.map((tag: { label: string; value: number }) => {
        return { tag: { id: tag.value, name: tag.label } };
      }),
      screenshots: formData.screenshots || [],
      free_plan_details,
      paid_plan_details,
      platform_availability: selectedPlatforms,
      pricing_model,
      free_plan_available: freePlanAvailable === "Yes",
      approved: tool?.approved || false,
      status: tool?.status || ToolsStatus.Pending,
      user_id: userHook.userId!,
      is_featured: Boolean(formProps.isFeatured),
      category_id: selectPrimaryCategory?.value,
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
        // Add secondary categories
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
        platform_availability: selectedPlatforms,
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
    setSelectedTags([]);
    setSelectedSecondaryCategories([]);
    setSelectedRoles([]);
    setSelectedIndustries([]);
    setIncomingCategories(transformedCategories);
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
  };

  return (
    <DialogContainer
      title={tool ? "Edit tool" : "Submit tool"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="1044px"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createToolDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
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
