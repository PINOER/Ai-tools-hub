import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Glossary } from "@/types/glossary";

export interface CreateGlossaryForm {
  term: string;
  url_slug: string;
  definition: string;
  status: string;
  published_date: string;
  published_time: string;
  allow_comments: boolean;
  is_featured: boolean;
  category_id: number;
  secondary_category_ids: []
}

export const useCreateGlossaryForm = (glossary?: Glossary | null) => {
    // Get primary category ID from glossaryCategories array
    const getPrimaryCategoryId = (glossary?: any) => {
      if (!glossary?.glossaryCategories || glossary.glossaryCategories.length === 0) return 0;
      return glossary.glossaryCategories[0]?.category?.id || 0;
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
  } = useForm<CreateGlossaryForm>({
    defaultValues: {
      term: "",
      url_slug: "",
      definition: "",
      status: "Draft",
      published_date: "",
      published_time: "",
      allow_comments: true,
      is_featured: false,
      category_id: getPrimaryCategoryId(glossary),
      secondary_category_ids: glossary?.secondary_category_ids || [],
    },
  });

  useEffect(() => {
    if (glossary) {
      setValue("term", glossary.term);
      setValue("url_slug", glossary.term.toLowerCase().replace(/\s+/g, "-"));
      setValue("definition", glossary.definition || "");
      setValue("status", glossary.status);
      setValue("allow_comments", glossary.allow_comments || true);
      setValue("is_featured", glossary.is_featured || false);
      setValue("category_id", getPrimaryCategoryId(glossary));
      setValue("secondary_category_ids", glossary.secondary_category_ids || []);   
    }
  }, [glossary, setValue]);

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
  };
}; 