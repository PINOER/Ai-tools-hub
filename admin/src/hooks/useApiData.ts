import { useEffect, useState, useCallback } from "react";
import { useUser } from "./useUser";
import type { Pagination } from "@/types";

interface UseApiDataOptions<T> {
  fetchFunction: (token: string, params?: any) => Promise<{ data: T[]; pagination: Pagination }>;
  initialParams?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
  };
}

export function useApiData<T>({
  fetchFunction,
  initialParams = {},
}: UseApiDataOptions<T>) {
  const userHook = useUser();
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    if (!userHook.token) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(userHook.token, params);
      setData(result.data);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
      if (err.response?.status === 401) {
        // Handle unauthorized
      }
    } finally {
      setLoading(false);
    }
  }, [userHook.token, fetchFunction, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    setData,
    pagination,
    loading,
    error,
    params,
    updateParams,
    refresh,
  };
}
