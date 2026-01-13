import { CREATE_PROMPT_DIALOG_TABS } from "@/lib/contants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/DialogContainer";
import Tabs from "@/components/Tabs";
import { usePromptCreationData } from "@/hooks/prompts/usePromptCreationData";
import { usePromptFormState } from "@/hooks/prompts/usePromptFormState";
import { useCreatePromptForm } from "@/hooks/prompts/useCreatePromptForm";
import { useCreatePromptMutation, useUpdatePromptMutation } from "@/hooks/queries/usePromptsQueries";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreatePromptBasicInfo } from "./CreatePromptBasicInfo";
import { CreatePromptContent } from "./CreatePromptContent";
import { CreatePromptPublishing } from "./CreatePromptPublishing";
import { PromptDetailGeneric } from "./PromptDetailGeneric";
import { PromptDetails } from "./PromptDetails";

interface CreatePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  prompt?: any | null;
}

const createPromptDialogOptions = [
  CREATE_PROMPT_DIALOG_TABS.basic_info,
  CREATE_PROMPT_DIALOG_TABS.content,
  CREATE_PROMPT_DIALOG_TABS.publishing,
  CREATE_PROMPT_DIALOG_TABS.review_and_submit,
];

// Component for dialog buttons
const DialogButtons = ({
  selectedTab,
  loading,
  onBackClick,
  onSubmit,
  prompt,
}: {
  selectedTab: string;
  loading: boolean;
  onBackClick: () => void;
  onSubmit: () => void;
  prompt?: any | null;
}) => (
  <div className="flex items-center gap-3 px-6 mb-4">
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
      {selectedTab === CREATE_PROMPT_DIALOG_TABS.basic_info ? "Cancel" : "Back"}
    </div>
    <button
      type="submit"
      className="w-3/6 text-center rounded-md py-1 flex items-center justify-center text-white bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading && <LoadingSpinner />}
      {selectedTab === CREATE_PROMPT_DIALOG_TABS.review_and_submit
        ? loading
          ? "Submitting..."
          : prompt ? "Update prompt" : "Submit prompt"
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
  finalPromptDetails,
  formProps,
  categoryProps,
  contentProps,
  publishingProps,
  selectedTags,
}: {
  selectedTab: string;
  dataLoading: boolean;
  finalPromptDetails: any;
  formProps: any;
  categoryProps: any;
  contentProps: any;
  publishingProps: any;
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
    case CREATE_PROMPT_DIALOG_TABS.basic_info:
      return <CreatePromptBasicInfo {...formProps} {...categoryProps} {...contentProps} />;

    case CREATE_PROMPT_DIALOG_TABS.content:
      return <CreatePromptContent {...formProps} {...contentProps} />;

    case CREATE_PROMPT_DIALOG_TABS.publishing:
      return <CreatePromptPublishing {...publishingProps} />;

    case CREATE_PROMPT_DIALOG_TABS.review_and_submit: {
      // Always ensure current tags are displayed in review
      const promptForReview = {
        ...(finalPromptDetails || {}),
        promptTags: selectedTags.map(tag => ({ tag: { id: tag.value, name: tag.label } }))
      };
      
      return (
        <>
          <PromptDetailGeneric prompt={promptForReview!} />
          <PromptDetails prompt={promptForReview!} />
        </>
      );
    }

    default:
      return null;
  }
};

export const CreatePromptDialog = ({
  open,
  onOpenChange,
  categories,
  tags,
  prompt,
}: CreatePromptProps) => {
  const {
    transformedCategories,
    transformedTags,
    isLoading: dataLoading,
  } = usePromptCreationData(categories, tags);

  const {
    selectedTab,
    setSelectedTab,
    finalPromptDetails,
    setFinalPromptDetails,
    loading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
  } = usePromptFormState();

  const formProps = useCreatePromptForm(prompt);
  const createPromptMutation = useCreatePromptMutation();
  const updatePromptMutation = useUpdatePromptMutation();
  const userHook = useUser();
  const submissionLoading = createPromptMutation.isPending || updatePromptMutation.isPending;

  useEffect(() => {
    setIncomingCategories(transformedCategories);
  }, [transformedCategories, setIncomingCategories]);

  useEffect(() => {
    if (prompt) {
      // Set categories
      if (prompt.promptCategories && prompt.promptCategories.length > 0) {
        const primaryCategory = prompt.promptCategories[0];
        setSelectPrimaryCategory({
          label: primaryCategory.category.name,
          value: primaryCategory.category.id,
        });

        const secondaryCategories = prompt.promptCategories.slice(1).map((cat: any) => ({
          label: cat.category.name,
          value: cat.category.id,
        }));
        setSelectedSecondaryCategories(secondaryCategories);
      }

      // Set tags
      if (prompt.promptTags) {
        const tags = prompt.promptTags.map((tag: any) => ({
          label: tag.tag.name,
          value: tag.tag.id,
        }));
        setSelectedTags(tags);
      }
    }
  }, [prompt, setSelectPrimaryCategory, setSelectedSecondaryCategories, setSelectedTags]);

  const handleBackClick = () => {
    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.review_and_submit) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.content) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    formProps.reset();
  };

  const allRequiredFields = [
    "title",
    "url_slug",
    "category_id",
    "ai_models",
    "main_prompt",
    "short_description",
    "user_guide",
  ];

  const nextButtonClick = async (formData: any) => {
    const {
      title,
      url_slug,
      short_description,
      main_prompt,
      user_guide,
      status,
      allow_comments,
    } = formData;



    const promptData = {
     title, 
      url_slug,
      category_id: selectPrimaryCategory?.value,
      secondary_category_ids: selectedSecondaryCategories.map(cat => cat.value),
      status,
      ai_models: formData.ai_models || [],
      main_prompt,
      short_description,
      user_guide,
      tags: selectedTags,
      allow_comments,
      published_date: formData.published_date,
      published_time: formData.published_time,
      promptCategories: [
        selectPrimaryCategory && {
          category: {
            id: selectPrimaryCategory.value,
            name: selectPrimaryCategory.label,
            section: "Prompt",
            url_slug: selectPrimaryCategory.label.toLowerCase().replace(/\s+/g, "-"),
            description: "",
            display_order: 1,
            seo_title: selectPrimaryCategory.label,
            parentCategoryId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            parent_category: null,
            items: 0,
          },
        },
        ...selectedSecondaryCategories.map((category: { label: string; value: number }) => ({
          category: {
            id: category.value,
            name: category.label,
            section: "Prompt",
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
      ].filter((promptCategory) => promptCategory !== undefined),
      promptTags: selectedTags.map((tag: { label: string; value: number }) => {
        return { tag: { id: tag.value, name: tag.label } };
      }),
      user_id: userHook.userId!,
      is_featured: Boolean(formProps.isFeatured),
    };

    setFinalPromptDetails(promptData);

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.content) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_PROMPT_DIALOG_TABS.review_and_submit);
      return;
    }

    if (selectedTab === CREATE_PROMPT_DIALOG_TABS.review_and_submit) {
      const valid = await formProps.trigger(allRequiredFields as any);
      if (!valid) return;

    

      const promptData = {
        ...formData,
        title: formData.title, // API expects headline
        ai_models: formData.ai_models || [],
        tags: selectedTags.map((tag: { label: string; value: number }) => tag.label),
        published_date: formData.published_date,
        published_time: formData.published_time,
      };

      let success;
      if (prompt) {
        // Update existing prompt
        await updatePromptMutation.mutateAsync({ id: prompt.id, data: promptData });
        success = true;
      } else {
        // Create new prompt
        await createPromptMutation.mutateAsync(promptData);
        success = true;
      }

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
    setSelectedTab(CREATE_PROMPT_DIALOG_TABS.basic_info);
    setSelectedTags([]);
    setSelectedSecondaryCategories([]);
    setIncomingCategories(transformedCategories);
  };

  const categoryProps = {
    incomingCategories,
    selectPrimaryCategory,
    selectedSecondaryCategories,
    handleCategoryChange,
    handleSecondaryCategoriesChange,
  };

  const contentProps = {
    incomingTags: transformedTags,
    selectedTags,
    setSelectedTags,
  };

  const publishingProps = {
    control: formProps.control,
    register: formProps.register,
  };

  return (
      <DialogContainer
      title={prompt ? "Edit prompt" : "Submit prompt"}
        open={open}
        onOpenChange={onOpenChange}
        maxWidth="4xl"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createPromptDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
      />

      <TabContent
        selectedTab={selectedTab}
        dataLoading={dataLoading}
        finalPromptDetails={finalPromptDetails}
        formProps={formProps}
        categoryProps={categoryProps}
        contentProps={contentProps}
        publishingProps={publishingProps}
        selectedTags={selectedTags}
      />

      <DialogButtons
        selectedTab={selectedTab}
        loading={loading || submissionLoading}
        onBackClick={handleBackClick}
        onSubmit={formProps.handleSubmit(nextButtonClick)}
        prompt={prompt}
      />
    </DialogContainer>
  );
}; 