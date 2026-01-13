import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Learning } from "@/types/learning";

export interface CreateLearningForm {
  title: string;
  url_slug: string;
  content: string;
  lesson_link: string;
  skill_level: string;
  status: string;
  published_date: string;
  published_time: string;
  allow_comments: boolean;
  is_featured: boolean;
  category_id: number;
  secondary_category_ids: number[];
  image: string | File | null,
}

export const useCreateLearningForm = (learning?: Learning | null) => {
  // Get primary category ID from learningCategories array
  const getPrimaryCategoryId = (learning?: any) => {
    if (
      !learning?.learningCategories ||
      learning.learningCategories.length === 0
    )
      return 0;
    return learning.learningCategories[0]?.category?.id || 0;
  };

  // Get secondary category IDs from learningCategories array
  const getSecondaryCategoryIds = (learning?: any) => {
    if (
      !learning?.learningCategories ||
      learning.learningCategories.length <= 1
    )
      return [];
    return learning.learningCategories
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
  } = useForm<CreateLearningForm>({
    defaultValues: {
      title: "",
      url_slug: "",
      content: "",
      lesson_link: "",
      skill_level: "Beginner",
      status: "Draft",
      published_date: "",
      published_time: "",
      allow_comments: true,
      is_featured: false,
      category_id: getPrimaryCategoryId(learning),
      secondary_category_ids: getSecondaryCategoryIds(learning),
      image: null,
    },
  });

  useEffect(() => {
    if (learning) {
      setValue("title", learning.title || "");
      setValue("url_slug", learning.url_slug || "");
      setValue("content", learning.content || "");
      setValue("lesson_link", learning.lesson_link || "");
      setValue("status", learning.status || "Draft");
      setValue("published_date", learning.published_date || "");
      setValue("published_time", learning.published_time || "");
      setValue(
        "allow_comments",
        learning.allow_comments !== undefined ? learning.allow_comments : true,
      );
      setValue("is_featured", learning.is_featured || false);
      setValue("category_id", getPrimaryCategoryId(learning));
      setValue("secondary_category_ids", getSecondaryCategoryIds(learning));
      setValue("image", learning.image || null);
    }
  }, [learning, setValue]);

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
