import { useEffect, useState } from 'react';
import { getCategoriesApi } from '@/api/categories';
import { getTagsApi } from '@/api/tags';
import { useUser } from './useUser';
import type { ToolClaim, ToolSubmission } from '@/types/tools';
import { getToolClaimsApi, getToolSubmissionsApi } from '@/api/tools';

interface UseFetchWithCategoriesAndTagsOptions<T> {
  fetchMain: (params?: any) => Promise<T[] | { data: T[]; pagination?: any }>;
}

export function useFetchWithCategoriesAndTags<T>({ fetchMain }: UseFetchWithCategoriesAndTagsOptions<T>) {
  const userHook = useUser();
  const [data, setData] = useState<T[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<ToolSubmission[]>([]);
  const [claims, setClaims] = useState<ToolClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigateToLogin, setNavigateToLogin] = useState(false);

  useEffect(() => {
    if (!userHook.token) return;
    setLoading(true);
    Promise.all([
      fetchMain(),
      getCategoriesApi(),
      getTagsApi(),
      getToolSubmissionsApi(),
      getToolClaimsApi(),
    ])
      .then(([mainData, categoriesData, tagsData, submissionsData, claimsData]) => {
        setData(Array.isArray(mainData) ? mainData : mainData.data);
        setCategories(categoriesData.categories);
        setTags(Array.isArray(tagsData) ? tagsData : tagsData.tags || tagsData);
        setSubmissions(submissionsData);
        setClaims(claimsData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        if (error.response.status === 401) {
          setNavigateToLogin(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userHook.token, fetchMain]);

  return { data, setData, categories, tags, submissions, setSubmissions, claims, setClaims, loading, navigateToLogin };
} 