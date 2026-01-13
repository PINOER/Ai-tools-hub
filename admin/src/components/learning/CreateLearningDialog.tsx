import { CREATE_LEARNING_DIALOG_TABS } from "@/lib/contants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/DialogContainer";
import Tabs from "@/components/Tabs";
import { useLearningFormState } from "@/hooks/learning/useLearningFormState";
import { useCreateLearningForm } from "@/hooks/learning/useCreateLearningForm";
import {
  useCreateLearningMutation,
  useUpdateLearningMutation,
} from "@/hooks/queries/useLearningQueries";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreateLearningBasicInfo } from "./CreateLearningBasicInfo";
import { CreateLearningContent } from "./CreateLearningContent";
import { CreateLearningPublishing } from "./CreateLearningPublishing";
import LearningDetails from "./LearningDetail";
import { getCurrentDateTimeISO } from "@/lib/utils";
import { LearningDetailGeneric } from "./LearningDetailGeneric";
import { useLearningCreationData } from "@/hooks/learning/useLearningCreationData";

interface CreatelearningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  learning?: any | null;
}

const createLearningDialogOptions = [
  CREATE_LEARNING_DIALOG_TABS.basic_info,
  CREATE_LEARNING_DIALOG_TABS.content,
  CREATE_LEARNING_DIALOG_TABS.publishing,
  CREATE_LEARNING_DIALOG_TABS.preview,
];

// Component for dialog buttons
const DialogButtons = ({
  selectedTab,
  loading,
  onBackClick,
  onSubmit,
  learning,
}: {
  selectedTab: string;
  loading: boolean;
  onBackClick: () => void;
  onSubmit: () => void;
  learning?: any | null;
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
      {selectedTab === CREATE_LEARNING_DIALOG_TABS.basic_info
        ? "Cancel"
        : "Back"}
    </div>
    <button
      type="submit"
      className="w-3/6 text-center rounded-md py-1 flex items-center justify-center text-white bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      onClick={onSubmit}
      disabled={loading}
    >
      {loading && <LoadingSpinner />}
      {selectedTab === CREATE_LEARNING_DIALOG_TABS.preview
        ? loading
          ? "Submitting..."
          : learning
            ? "Update learning"
            : "Submit learning"
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
  finalLearningDetails,
  formProps,
  categoryProps,
  contentProps,
  publishingProps,
}: {
  selectedTab: string;
  dataLoading: boolean;
  finalLearningDetails: any;
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
    case CREATE_LEARNING_DIALOG_TABS.basic_info:
      return (
        <CreateLearningBasicInfo
          {...formProps}
          {...categoryProps}
          {...contentProps}
        />
      );

    case CREATE_LEARNING_DIALOG_TABS.content:
      return <CreateLearningContent {...formProps} {...contentProps} />;

    case CREATE_LEARNING_DIALOG_TABS.publishing:
      return <CreateLearningPublishing {...publishingProps} />;

    case CREATE_LEARNING_DIALOG_TABS.preview:
      return (
        <div className="p-10">
          <LearningDetailGeneric learning={finalLearningDetails!} />
          <LearningDetails learning={finalLearningDetails!} />
        </div>
      );

    default:
      return null;
  }
};

export const CreateLearningDialog = ({
  open,
  onOpenChange,
  categories,
  tags,
  learning,
}: CreatelearningProps) => {
  const {
    transformedCategories,
    transformedTags,
    isLoading: dataLoading,
  } = useLearningCreationData(categories, tags);

  const {
    selectedTab,
    setSelectedTab,
    finalLearningDetails,
    setFinalLearningDetails,
    loading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
  } = useLearningFormState();

  const formProps = useCreateLearningForm(learning);
  const createLearningMutation = useCreateLearningMutation();
  const updateLearningMutation = useUpdateLearningMutation();
  const userHook = useUser();
  const submissionLoading =
    createLearningMutation.isPending || updateLearningMutation.isPending;

  useEffect(() => {
    setIncomingCategories(transformedCategories);
  }, [transformedCategories, setIncomingCategories]);

  useEffect(() => {
    if (learning) {
      // Set categories
      if (
        learning.learningCategories &&
        learning.learningCategories.length > 0
      ) {
        const primaryCategory = learning.learningCategories[0];
        setSelectPrimaryCategory({
          label: primaryCategory.category.name,
          value: primaryCategory.category.id,
        });

        const secondaryCategories = learning.learningCategories
          .slice(1)
          .map((cat: any) => ({
            label: cat.category.name,
            value: cat.category.id,
          }));
        setSelectedSecondaryCategories(secondaryCategories);
      }

      // Set tags
      if (learning.learningTags) {
        const tags = learning.learningTags.map((tag: any) => ({
          label: tag.tag.name,
          value: tag.tag.id,
        }));
        setSelectedTags(tags);
      }
    }
  }, [
    learning,
    setSelectPrimaryCategory,
    setSelectedSecondaryCategories,
    setSelectedTags,
  ]);

  const handleBackClick = () => {
    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.preview) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.content) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    formProps.reset();
  };

  const allRequiredFields = [
    "title",
    "url_slug",
    "category_id",
    "content",
    "lesson_link",
    "skill_level",
    "image"
  ];

  const nextButtonClick = async (formData: any) => {
    const {
      title,
      url_slug,
      content,
      lesson_link,
      skill_level,
      status,
      published_date,
      published_time,
      allow_comments,
      image
    } = formData;



    const learningData = {
      title,
      url_slug,
      category_ids: [selectPrimaryCategory?.value],
      secondary_category_ids: selectedSecondaryCategories.map(
        (cat) => cat.value,
      ),
      status,
      image,
      skill_level,
      content,
      lesson_link,
      tags: selectedTags.map((tag) => tag.label),
      allow_comments,
      published_date,
      published_time,
      learningCategories: [
        selectPrimaryCategory && {
          category: {
            id: selectPrimaryCategory.value,
            name: selectPrimaryCategory.label,
            section: "Learning",
            url_slug: selectPrimaryCategory.label
              .toLowerCase()
              .replace(/\s+/g, "-"),
            description: "",
            display_order: 1,
            seo_title: selectPrimaryCategory.label,
            parentCategoryId: null,
            createdAt: getCurrentDateTimeISO().publishedDate,
            updatedAt: getCurrentDateTimeISO().publishedDate,
            parent_category: null,
            items: 0,
          },
        },
        ...selectedSecondaryCategories.map(
          (category: { label: string; value: number }) => ({
            category: {
              id: category.value,
              name: category.label,
              section: "Learning",
              url_slug: category.label.toLowerCase().replace(/\s+/g, "-"),
              description: "",
              display_order: 1,
              seo_title: category.label,
              parentCategoryId: null,
              createdAt: getCurrentDateTimeISO().publishedDate,
              updatedAt: getCurrentDateTimeISO().publishedDate,
              parent_category: null,
              items: 0,
            },
          }),
        ),
      ].filter((learningCategory) => learningCategory !== undefined),
      learningTags: selectedTags.map((tag: { label: string; value: number }) => tag.label),
      user_id: learning?.user_id || userHook.userId,
      user: learning?.user || { id: userHook.userId ,username: userHook.name },
      is_featured: Boolean(formProps.isFeatured),
    };

    setFinalLearningDetails(learningData);

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.content) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_LEARNING_DIALOG_TABS.preview);
      return;
    }

    if (selectedTab === CREATE_LEARNING_DIALOG_TABS.preview) {
      const valid = await formProps.trigger(allRequiredFields as any);
      if (!valid) return;
    

      const learningData = {
        ...formData,
        title: formData.title,
        image: typeof image === 'string' ? image : URL.createObjectURL(formData.image),
        skill_level: formData.skill_level || "Beginner",
        tags: selectedTags
          .map((tag: { label: string; value: number }) => tag.label),
        published_date: formData.published_date,
        published_time: formData.published_time,
        category_ids: [selectPrimaryCategory?.value],
        secondary_category_ids: selectedSecondaryCategories.map(
        (cat) => cat.value,
        ),
      };

      let success;
      if (learning) {
        // Update existing learning
        await updateLearningMutation.mutateAsync({
          id: learning.id,
          data: learningData,
        });
        success = true;
      } else {
        // Create new learning
        await createLearningMutation.mutateAsync(learningData);
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
    type: "primary" | "secondary",
  ) => {
    if (!newValue) return;

    if (type === "primary") {
      setSelectPrimaryCategory({
        label: newValue.label,
        value: newValue.value,
      });
      setIncomingCategories((prev) =>
        prev.filter((value) => value !== newValue),
      );
      setSelectedSecondaryCategories((prev) =>
        prev.filter((category) => category.value !== newValue.value),
      );
    }
  };

  const handleSecondaryCategoriesChange = (
    newValues: readonly { label: string; value: number }[],
  ) => {
    if (newValues.length > 2) {
      return;
    }
    setSelectedSecondaryCategories([...newValues]);
  };

  const resetAll = () => {
    formProps.reset();
    setSelectedTab(CREATE_LEARNING_DIALOG_TABS.basic_info);
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
      title={learning ? "Edit learning" : "Submit learning"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createLearningDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
      />

      <TabContent
        selectedTab={selectedTab}
        dataLoading={dataLoading}
        finalLearningDetails={finalLearningDetails}
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
        learning={learning}
      />
    </DialogContainer>
  );
};
