import { useEffect, useState, useCallback } from "react";
import type { Pagination } from "@/types";

interface UseDataTableOptions {
  fetchFunction: (params?: any) => Promise<{ data: any }>;
  initialParams?: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    [key: string]: any;
  };
  dataKey?: string; // Key to extract data from response (e.g., 'tools', 'users', etc.)
  paginationKey?: string; // Key to extract pagination from response
}

interface UseDataTableReturn<T> {
  data: T[];
  setData: (data: T[] | ((prev: T[]) => T[])) => void;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
  search: string;
  filters: Record<string, any>;
  setSearch: (search: string) => void;
  setFilters: (filters: Record<string, any>) => void;
  updateParams: (newParams: Partial<NonNullable<UseDataTableOptions['initialParams']>>) => void;
  refresh: () => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleSearch: (search: string) => void;
  handleFiltersChange: (filters: Record<string, any>) => void;
}

export function useDataTable<T>({
  fetchFunction,
  initialParams = {},
  dataKey = 'data',
  paginationKey = 'pagination',
}: UseDataTableOptions): UseDataTableReturn<T> {
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
  const [search, setSearch] = useState(initialParams.search || '');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(params);
      
      // Extract data using the provided key or fallback to 'data'
      const responseData = result.data[dataKey] || result.data;
      const responsePagination = result.data[paginationKey] || result.data.pagination;
      
      setData(responseData);
      if (responsePagination) {
        setPagination(responsePagination);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch data");
      if (err.response?.status === 401) {
        // Handle unauthorized
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params, dataKey, paginationKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const handleLimitChange = useCallback((limit: number) => {
    updateParams({ limit, page: 1 }); // Reset to first page when changing limit
  }, [updateParams]);

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
    updateParams({ search: searchTerm, page: 1 }); // Reset to first page when searching
  }, [updateParams]);

  const handleFiltersChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    updateParams({ ...newFilters, page: 1 }); // Reset to first page when filtering
  }, [updateParams]);

  return {
    data,
    setData,
    pagination,
    loading,
    error,
    search,
    filters,
    setSearch,
    setFilters,
    updateParams,
    refresh,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleFiltersChange,
  };
} 