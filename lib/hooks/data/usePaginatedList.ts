import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useInfiniteScroll } from "@/lib/hooks/data/useInfiniteScroll";
import type { PaginationResult } from "@/lib/data/blogs";
import {
  type PaginationState,
  buildPaginatedFetchUrl,
  parsePaginatedResponse,
} from "./paginatedListUtils";
import { usePaginatedListPrefetch } from "./usePaginatedListPrefetch";

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
  const fetchAbortRef = useRef<AbortController | null>(null);

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

  const fetchItems = useCallback(
    async (page: number, reset = false) => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }

      const abortController = new AbortController();
      fetchAbortRef.current = abortController;

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const res = await fetch(
          buildPaginatedFetchUrl(endpoint, page, pageSize, stableQueryParams),
          { signal: abortController.signal },
        );
        const data = await res.json();
        const parsed = parsePaginatedResponse(
          data,
          resolveData,
          dataKey,
          paginationKey,
        );

        setItems((prev) => (reset ? parsed.items : [...prev, ...parsed.items]));

        if (parsed.pagination) {
          setPagination(parsed.pagination);
          schedulePrefetch(parsed.pagination.page, parsed.pagination.hasMore);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(`Failed to fetch items from ${endpoint}`, error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [
      endpoint,
      pageSize,
      stableQueryParams,
      resolveData,
      dataKey,
      paginationKey,
      schedulePrefetch,
    ],
  );

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
      fetchAbortRef.current?.abort();
      abortPrefetch();
    };
  }, [abortPrefetch]);

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
