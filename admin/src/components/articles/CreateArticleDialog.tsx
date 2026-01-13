import { CREATE_ARTICLE_DIALOG_TABS } from "@/lib/contants";
import { useEffect } from "react";
import type { Category } from "@/types/categories";
import type { Tag } from "@/types/tag";
import DialogContainer from "@/components/DialogContainer";
import Tabs from "@/components/Tabs";
import { useUser } from "@/hooks/useUser";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CreateArticlePublishing } from "./CreateArticlePublishing";
import { getCurrentDateTimeISO } from "@/lib/utils";
import { CreateArticleBasicInfo } from "./CreateArticlesBasicInfo";
import { CreateArticleContent } from "./CreateArticlesContent";
import ArticleDetails from "./ArticleDetails";
import { useArticleFormState } from "@/hooks/articles/useArticlesFormState";
import { useCreateArticleForm } from "@/hooks/articles/useCreateArticlesForm";
import { useCreateArticleMutation, useUpdateArticleMutation } from "@/hooks/queries/useArticlesQueries";
import { useArticleCreationData } from "@/hooks/articles/useArticlesCreationData";
import { ArticleDetailGeneric } from "./ArticleDetailGeneric";

interface CreateArticleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  tags: Tag[];
  article?: any | null;
}

const createArticleDialogOptions = [
  CREATE_ARTICLE_DIALOG_TABS.basic_info,
  CREATE_ARTICLE_DIALOG_TABS.content,
  CREATE_ARTICLE_DIALOG_TABS.publishing,
  CREATE_ARTICLE_DIALOG_TABS.preview,
];

// Component for dialog buttons
const DialogButtons = ({
  selectedTab,
  loading,
  onBackClick,
  onSubmit,
  article,
}: {
  selectedTab: string;
  loading: boolean;
  onBackClick: () => void;
  onSubmit: () => void;
  article?: any | null;
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
      {selectedTab === CREATE_ARTICLE_DIALOG_TABS.basic_info
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
      {selectedTab === CREATE_ARTICLE_DIALOG_TABS.preview
        ? loading
          ? "Submitting..."
          : article
            ? "Update article"
            : "Submit article"
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
  finalArticleDetails,
  formProps,
  categoryProps,
  contentProps,
  publishingProps,
}: {
  selectedTab: string;
  dataLoading: boolean;
  finalArticleDetails: any;
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
    case CREATE_ARTICLE_DIALOG_TABS.basic_info:
      return (
        <CreateArticleBasicInfo
          {...formProps}
          {...categoryProps}
          {...contentProps}
        />
      );

    case CREATE_ARTICLE_DIALOG_TABS.content:
      return <CreateArticleContent {...formProps} {...contentProps} />;

    case CREATE_ARTICLE_DIALOG_TABS.publishing:
      return <CreateArticlePublishing {...publishingProps} />;

    case CREATE_ARTICLE_DIALOG_TABS.preview:
      return (
        <div className="w-[80%] m-auto py-6">
          <ArticleDetailGeneric article={finalArticleDetails!} />
          <ArticleDetails article={finalArticleDetails!} />
        </div>
      );

    default:
      return null;
  }
};

export const CreateArticleDialog = ({
  open,
  onOpenChange,
  categories,
  tags,
  article,
}: CreateArticleProps) => {
  const {
    transformedCategories,
    transformedTags,
    isLoading: dataLoading,
  } = useArticleCreationData(categories, tags);

  const {
    selectedTab,
    setSelectedTab,
    finalArticleDetails,
    setFinalArticleDetails,
    loading,
    selectPrimaryCategory,
    setSelectPrimaryCategory,
    selectedSecondaryCategories,
    setSelectedSecondaryCategories,
    incomingCategories,
    setIncomingCategories,
    selectedTags,
    setSelectedTags,
  } = useArticleFormState();

  const formProps = useCreateArticleForm(article);
  const createArticleMutation = useCreateArticleMutation();
  const updateArticleMutation = useUpdateArticleMutation();
  const userHook = useUser();
  const submissionLoading =
    createArticleMutation.isPending || updateArticleMutation.isPending;

  useEffect(() => {
    setIncomingCategories(transformedCategories);
  }, [transformedCategories, setIncomingCategories]);

  useEffect(() => {
    if (article) {
      // Set categories
      if (
        article.articleCategories &&
        article.articleCategories.length > 0
      ) {
        const primaryCategory = article.articleCategories[0];
        setSelectPrimaryCategory({
          label: primaryCategory.category.name,
          value: primaryCategory.category.id,
        });

        const secondaryCategories = article.articleCategories
          .slice(1)
          .map((cat: any) => ({
            label: cat.category.name,
            value: cat.category.id,
          }));
        setSelectedSecondaryCategories(secondaryCategories);
      }

      // Set tags
      if (article.articleTags) {
        const tags = article.articleTags.map((tag: any) => ({
          label: tag.tag.name,
          value: tag.tag.id,
        }));
        setSelectedTags(tags);
      }
    }
  }, [
    article,
    setSelectPrimaryCategory,
    setSelectedSecondaryCategories,
    setSelectedTags,
  ]);

  const handleBackClick = () => {
    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.preview) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.content) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.basic_info);
      return;
    }

    onOpenChange(false);
    formProps.reset();
  };

  const allRequiredFields = [
    "headline",
    "url_slug",
    "category_id",
    "content",
    "skill_level",
    "image"
  ];

  const nextButtonClick = async (formData: any) => {
    const {
      headline,
      url_slug,
      content,
      skill_level,
      image,
      status,
      published_date,
      published_time,
      allow_comments,
    } = formData;



    const articleData = {
      headline,
      url_slug,
      category_ids: [selectPrimaryCategory?.value],
      secondary_category_ids: selectedSecondaryCategories.map(
        (cat) => cat.value,
      ),
      status,
      skill_level,
      image,
      content,
              tags: selectedTags.map((tag) => tag.label),
      allow_comments,
      published_date,
      published_time,
      articleCategories: [
        selectPrimaryCategory && {
          category: {
            id: selectPrimaryCategory.value,
            name: selectPrimaryCategory.label,
            section: "Article",
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
              section: "Article",
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
      ].filter((articleCategory) => articleCategory !== undefined),
      articleTags: selectedTags.map(
        (tag: { label: string; value: number }) => {
          return tag.label;
        },
      ),
      user_id: article?.user_id || userHook.userId,
      user: article?.user || { id: userHook.userId ,username: userHook.name },
      is_featured: Boolean(formProps.isFeatured),
    };

    setFinalArticleDetails(articleData);

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.basic_info) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.content);
      return;
    }

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.content) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.publishing);
      return;
    }

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.publishing) {
      setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.preview);
      return;
    }

    if (selectedTab === CREATE_ARTICLE_DIALOG_TABS.preview) {
      const valid = await formProps.trigger(allRequiredFields as any);
      if (!valid) return;

      const articleData = {
        ...formData,
        image: typeof image === 'string' ? image : URL.createObjectURL(formData.image),
        headline: formData.headline,
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
      if (article) {
        // Update existing article
        await updateArticleMutation.mutateAsync({
          id: article.id,
          data: articleData,
        });
        success = true;
      } else {
        // Create new article
        await createArticleMutation.mutateAsync(articleData);
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
    setSelectedTab(CREATE_ARTICLE_DIALOG_TABS.basic_info);
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
      title={article ? "Edit article" : "Submit article"}
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="4xl"
      resetOnClose={true}
      resetAll={resetAll}
    >
      <Tabs
        options={createArticleDialogOptions}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabClickable={false}
      />

      <TabContent
        selectedTab={selectedTab}
        dataLoading={dataLoading}
        finalArticleDetails={finalArticleDetails}
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
        article={article}
      />
    </DialogContainer>
  );
};
