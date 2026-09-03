import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useInfiniteScroll } from "@/lib/hooks/data/useInfiniteScroll";
import type { PaginationResult } from "@/lib/data/blogs";
import { type PaginationState } from "./paginatedListUtils";
import { usePaginatedListPrefetch } from "./usePaginatedListPrefetch";
import { usePaginatedListFetch } from "./usePaginatedListFetch";

interface UsePaginatedListOptions<T> {
  endpoint: string;
  pageSize: number;
  initialData?: T[];
  initialPagination?: PaginationResult;
  queryParams?: Record<string, string | number | boolean>;
  resolveData?: (data: Record<string, unknown>) => T[];
  dataKey?: string;
  paginationKey?: string;
  prefetchNextPage?: boolean;
  infiniteScrollRootMargin?: string;
}

const EMPTY_QUERY_PARAMS: Record<string, string | number | boolean> = {};

export function usePaginatedList<T>({
  endpoint,
  pageSize,
  initialData,
  initialPagination,
  queryParams,
  resolveData,
  dataKey = "data",
  paginationKey = "pagination",
  prefetchNextPage = false,
  infiniteScrollRootMargin = "200px",
}: UsePaginatedListOptions<T>) {
  const serializedParams = queryParams ? JSON.stringify(queryParams) : "";

  const stableQueryParams = useMemo(() => {
    return serializedParams ? JSON.parse(serializedParams) : EMPTY_QUERY_PARAMS;
  }, [serializedParams]);

  const hasInitialData = initialData && initialData.length > 0;

  const [items, setItems] = useState<T[]>(initialData ?? []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPagination?.page ?? 1,
    hasMore: initialPagination?.hasMore ?? true,
    total: initialPagination?.total ?? 0,
  });

  const initialFetchSkipped = useRef(hasInitialData);

  const {
    prefetchPage,
    schedulePrefetch,
    clearPrefetchCache,
    consumePrefetchedPage,
    abortPrefetch,
  } = usePaginatedListPrefetch({
    endpoint,
    pageSize,
    stableQueryParams,
    prefetchNextPage,
    resolveData,
    dataKey,
    paginationKey,
  });

  const { fetchItems, abortFetch } = usePaginatedListFetch({
    endpoint,
    pageSize,
    stableQueryParams,
    resolveData,
    dataKey,
    paginationKey,
    schedulePrefetch,
    setItems,
    setPagination,
    setLoading,
    setLoadingMore,
  });

  useEffect(() => {
    clearPrefetchCache();
  }, [serializedParams, clearPrefetchCache]);

  useEffect(() => {
    if (initialFetchSkipped.current) {
      initialFetchSkipped.current = false;
      return;
    }

    setItems([]);
    setPagination({ page: 1, hasMore: true, total: 0 });
    fetchItems(1, true);
  }, [fetchItems]);

  useEffect(() => {
    if (!prefetchNextPage || !hasInitialData || !initialPagination?.hasMore) {
      return;
    }

    void prefetchPage(2);
  }, [
    prefetchNextPage,
    hasInitialData,
    initialPagination?.hasMore,
    prefetchPage,
    serializedParams,
  ]);

  useEffect(() => {
    return () => {
      abortFetch();
      abortPrefetch();
    };
  }, [abortFetch, abortPrefetch]);

  const loadMore = useCallback(() => {
    if (loadingMore || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;
    const cached = consumePrefetchedPage(nextPage);

    if (cached) {
      setItems((prev) => [...prev, ...cached.items]);
      setPagination(cached.pagination);
      schedulePrefetch(cached.pagination.page, cached.pagination.hasMore);
      return;
    }

    fetchItems(nextPage);
  }, [
    loadingMore,
    pagination.hasMore,
    pagination.page,
    fetchItems,
    schedulePrefetch,
    consumePrefetchedPage,
  ]);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: pagination.hasMore,
    isLoading: loadingMore,
    rootMargin: infiniteScrollRootMargin,
  });

  return {
    items,
    loading,
    loadingMore,
    pagination,
    sentinelRef,
  };
}
