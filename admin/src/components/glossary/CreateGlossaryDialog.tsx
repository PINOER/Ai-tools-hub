import { CREATE_GLOSSARY_DIALOG_TABS } from "@/lib/contants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/DialogContainer";
import Tabs from "@/components/Tabs";
import { useGlossaryCreationData } from "@/hooks/glossary/useGlossaryCreationData";
import { useGlossaryFormState } from "@/hooks/glossary/useGlossaryFormState";
import { useCreateGlossaryForm } from "@/hooks/glossary/useCreateGlossaryForm";
import { useCreateGlossaryMutation, useUpdateGlossaryMutation } from "@/hooks/queries/useGlossaryQueries";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreateGlossaryBasicInfo } from "./CreateGlossaryBasicInfo";
import { CreateGlossaryContent } from "./CreateGlossaryContent";
import { CreateGlossaryPublishing } from "./CreateGlossaryPublishing";
import { GlossaryDetailGeneric } from "./GlossaryDetailGeneric";
import { GlossaryDetails } from "./GlossaryDetails";
import type { Glossary } from "@/types/glossary";

interface CreateGlossaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  glossary?: Glossary | null;
}

const createGlossaryDialogOptions = [
  CREATE_GLOSSARY_DIALOG_TABS.basic_info,
  CREATE_GLOSSARY_DIALOG_TABS.content,
  CREATE_GLOSSARY_DIALOG_TABS.publishing,
  CREATE_GLOSSARY_DIALOG_TABS.review_and_submit,
];

// Component for dialog buttons
const DialogButtons = ({
  selectedTab,
  loading,
  onBackClick,
  onSubmit,
  glossary,
}: {
  selectedTab: string;
  loading: boolean;
  onBackClick: () => void;
  onSubmit: () => void;
  glossary?: Glossary | null;
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
      {selectedTab === CREATE_GLOSSARY_DIALOG_TABS.basic_info ? "Cancel" : "Back"}
    </div>
    <button
      type="submit"
      className="w-3/6 text-center rounded-md py-1 flex items-center justify-center text-white bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading && <LoadingSpinner />}
      {selectedTab === CREATE_GLOSSARY_DIALOG_TABS.review_and_submit
        ? loading
          ? "Submitting..."
          : glossary ? "Update glossary" : "Submit glossary"
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
  finalGlossaryDetails,
  formProps,
  categoryProps,
  contentProps,
  publishingProps,
}: {
  selectedTab: string;
  dataLoading: boolean;
  finalGlossaryDetails: any;
  formProps: any;
  categoryProps: any;
  contentProps: any;
  publishingProps: any;
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
    case CREATE_GLOSSARY_DIALOG_TABS.basic_info:
      return <CreateGlossaryBasicInfo {...formProps} {...categoryProps} {...contentProps} />;

    case CREATE_GLOSSARY_DIALOG_TABS.content:
      return <CreateGlossaryContent {...formProps} {...contentProps} />;

    case CREATE_GLOSSARY_DIALOG_TABS.publishing:
      return <CreateGlossaryPublishing {...publishingProps} />;

    case CREATE_GLOSSARY_DIALOG_TABS.review_and_submit:
      return (
        <>
          <GlossaryDetailGeneric glossary={finalGlossaryDetails!} />
          <GlossaryDetails glossary={finalGlossaryDetails!} />
        </>
      );

    default:
      return null;
  }
};

export const CreateGlossaryDialog = ({
  open,
  onOpenChange,
  categories,
  tags,
  glossary,
}: CreateGlossaryProps) => {
  const {
    transformedCategories,
    transformedTags,
    isLoading: dataLoading,
  } = useGlossaryCreationData(categories, tags);

  const {
    selectedTab,
    setSelectedTab,
    finalGlossaryDetails,
    setFinalGlossaryDetails,
    loading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
  } = useGlossaryFormState();

  const formProps = useCreateGlossaryForm(glossary);
  const createGlossaryMutation = useCreateGlossaryMutation();
  const updateGlossaryMutation = useUpdateGlossaryMutation();
  const userHook = useUser();
  const submissionLoading = createGlossaryMutation.isPending || updateGlossaryMutation.isPending;

  useEffect(() => {
    setIncomingCategories(transformedCategories);
  }, [transformedCategories, setIncomingCategories]);

  useEffect(() => {
    if (glossary) {
      // Set categories
      if (glossary.glossary_categories && glossary.glossary_categories.length > 0) {
        const primaryCategory = glossary.glossary_categories[0];
        setSelectPrimaryCategory({
          label: primaryCategory.category.name,
          value: Number(primaryCategory.category.id),
        });

        const secondaryCategories = glossary.glossary_categories.slice(1).map((cat: any) => ({
          label: cat.category.name,
          value: Number(cat.category.id),
        }));
        setSelectedSecondaryCategories(secondaryCategories);
      }

      // Set tags
      if (glossary.glossary_tags) {
        const tags = glossary.glossary_tags.map((tag: any) => ({
          label: tag.tag.name,
          value: tag.tag.id,
        }));
        setSelectedTags(tags);
      }
    }
  }, [glossary, setSelectPrimaryCategory, setSelectedSecondaryCategories, setSelectedTags]);

  useEffect(() => {
    // Sync form's category_id with selectPrimaryCategory
    if (selectPrimaryCategory && selectPrimaryCategory.value) {
      formProps.setValue('category_id', selectPrimaryCategory.value);
    }
  }, [selectPrimaryCategory, formProps]);

  const handleBackClick = () => {
    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.review_and_submit) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.content) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    formProps.reset();
  };

  const allRequiredFields = [
    "term",
    "url_slug",
    "category_id",
    "definition",
  ];

  const nextButtonClick = async (formData: any) => {
    const {
      term,
      url_slug,
      definition,
      status,
      published_date,
      published_time,
      allow_comments,
      is_featured,
    } = formData;



    const glossaryData = {
      term,
      url_slug,
      category_id: selectPrimaryCategory?.value,
      secondary_category_ids: selectedSecondaryCategories.map(cat => cat.value),
      status,
      definition,
      allow_comments,
      published_date,
      published_time,
      glossary_categories: [
        selectPrimaryCategory && {
          category: {
            id: selectPrimaryCategory.value,
            name: selectPrimaryCategory.label,
          },
        },
        ...selectedSecondaryCategories.map((category: { label: string; value: number }) => ({
          category: {
            id: category.value,
            name: category.label,
          },
        })),
      ].filter((glossaryCategory) => glossaryCategory !== undefined),
      glossary_tags: selectedTags.map((tag: { label: string; value: number }) => {
        return tag.label;
      }),
      user_id: glossary?.user_id || userHook.userId,
      user: glossary?.user || { id: userHook.userId ,username: userHook.name },
      is_featured,
    };

    setFinalGlossaryDetails(glossaryData);

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.content) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.review_and_submit);
      return;
    }

    if (selectedTab === CREATE_GLOSSARY_DIALOG_TABS.review_and_submit) {
      const valid = await formProps.trigger(allRequiredFields as any);
      if (!valid) return;

      // Safely handle date/time conversion for submission using helper



      
    
      const glossaryData = {
        ...formData,
        term: formData.term,
        tags: selectedTags.map((tag: { label: string; value: number }) => tag.label),
          published_date: formData.published_date,
          published_time: formData.published_time,
      };

      let success;
      if (glossary) {
        // Update existing glossary
        await updateGlossaryMutation.mutateAsync({ id: glossary.id, data: glossaryData });
        success = true;
      } else {
        // Create new glossary
        await createGlossaryMutation.mutateAsync(glossaryData);
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
    setSelectedTab(CREATE_GLOSSARY_DIALOG_TABS.basic_info);
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
      title={glossary ? "Edit glossary" : "Submit glossary"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createGlossaryDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
      />

      <TabContent
        selectedTab={selectedTab}
        dataLoading={dataLoading}
        finalGlossaryDetails={finalGlossaryDetails}
        formProps={formProps}
        categoryProps={categoryProps}
        contentProps={contentProps}
        publishingProps={publishingProps}
      />

      <DialogButtons
        selectedTab={selectedTab}
        loading={loading || submissionLoading}
        onBackClick={handleBackClick}
        onSubmit={formProps.handleSubmit(nextButtonClick)}
        glossary={glossary}
      />
    </DialogContainer>
  );
}; 