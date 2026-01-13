import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Article } from "@/types/article";

export interface CreateArticleForm {
  headline: string;
  url_slug: string;
  content: string;
  skill_level: string;
  status: string;
  published_date: string;
  published_time: string;
  allow_comments: boolean;
  featured_on_homepage: false,
  include_in_newsletter: false,
  image: string | File | null,
  is_featured: boolean;
  category_id: number;
  secondary_category_ids: number[];
}

export const useCreateArticleForm = (article?: Article | null) => {
  // Get primary category ID from articleCategories array
  const getPrimaryCategoryId = (article?: any) => {
    if (
      !article?.articleCategories ||
      article.articleCategories.length === 0
    )
      return 0;
    return article.articleCategories[0]?.category?.id || 0;
  };

  // Get secondary category IDs from articleCategories array
  const getSecondaryCategoryIds = (article?: any) => {
    if (
      !article?.articleCategories ||
      article.articleCategories.length <= 1
    )
      return [];
    return article.articleCategories
      .slice(1)
      .map((cat: any) => cat.category?.id || 0);
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
    watch,
    trigger,
    setValue,
  } = useForm<CreateArticleForm>({
    defaultValues: {
      headline: "",
      url_slug: "",
      content: "",
      skill_level: "Beginner",
      status: "Draft",
      published_date: "",
      published_time: "",
      allow_comments: true,
      featured_on_homepage: false,
      include_in_newsletter: false,
      image: null,
      is_featured: false,
      category_id: getPrimaryCategoryId(article),
      secondary_category_ids: getSecondaryCategoryIds(article),
    },
  });

  useEffect(() => {
    if (article) {
      setValue("headline", article.headline || "");
      setValue(
        "url_slug",
        article.url_slug ||
          article.headline?.toLowerCase().replace(/\s+/g, "-") ||
          "",
      );
      setValue("content", article.content || "");
      setValue("status", article.status || "Draft");
      setValue("published_date", article.published_date || "");
      setValue("published_time", article.published_time || "");
      setValue(
        "allow_comments",
        article.allow_comments !== undefined ? article.allow_comments : true,
      );
      setValue("is_featured", article.is_featured || false);
      setValue("category_id", getPrimaryCategoryId(article));
      setValue("secondary_category_ids", getSecondaryCategoryIds(article));
      setValue("image", article.image);
    }
  }, [article, setValue]);

  return {
    register,
    control,
    handleSubmit,
    getValues,
    errors,
    reset,
    watch,
    trigger,
    setValue,
    // Add convenience properties
    isFeatured: watch("is_featured"),
  };
};
