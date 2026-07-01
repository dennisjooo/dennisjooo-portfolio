import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useInfiniteScroll } from "@/lib/hooks/data/useInfiniteScroll";
import type { PaginationResult } from "@/lib/data/blogs";

interface PaginationState {
  page: number;
  hasMore: boolean;
  total: number;
}

interface PrefetchedPage<T> {
  items: T[];
  pagination: PaginationState;
}

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

function toPaginationState(data: PaginationResult): PaginationState {
  return {
    page: data.page,
    hasMore: data.hasMore,
    total: data.total,
  };
}

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
  const prefetchAbortRef = useRef<AbortController | null>(null);
  const prefetchCacheRef = useRef<Map<number, PrefetchedPage<T>>>(new Map());
  const prefetchInFlightRef = useRef<number | null>(null);

  const buildFetchUrl = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", pageSize.toString());

      Object.entries(stableQueryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      return `${endpoint}?${params.toString()}`;
    },
    [endpoint, pageSize, stableQueryParams],
  );

  const parseFetchResponse = useCallback(
    (data: Record<string, unknown>) => {
      const newItems = resolveData
        ? resolveData(data)
        : (data[dataKey] as T[]) || [];
      const paginationData = data[paginationKey] as
        PaginationResult | undefined;

      return {
        items: newItems,
        pagination: paginationData ? toPaginationState(paginationData) : null,
      };
    },
    [resolveData, dataKey, paginationKey],
  );

  const prefetchPage = useCallback(
    async (page: number) => {
      if (!prefetchNextPage || page < 1) return;
      if (prefetchCacheRef.current.has(page)) return;
      if (prefetchInFlightRef.current === page) return;

      prefetchAbortRef.current?.abort();
      const abortController = new AbortController();
      prefetchAbortRef.current = abortController;
      prefetchInFlightRef.current = page;

      try {
        const res = await fetch(buildFetchUrl(page), {
          signal: abortController.signal,
        });
        const data = await res.json();
        const parsed = parseFetchResponse(data);

        if (
          !abortController.signal.aborted &&
          parsed.pagination &&
          parsed.items.length > 0
        ) {
          prefetchCacheRef.current.set(page, {
            items: parsed.items,
            pagination: parsed.pagination,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(
            `Failed to prefetch page ${page} from ${endpoint}`,
            error,
          );
        }
      } finally {
        if (prefetchInFlightRef.current === page) {
          prefetchInFlightRef.current = null;
        }
      }
    },
    [prefetchNextPage, buildFetchUrl, parseFetchResponse, endpoint],
  );

  const schedulePrefetch = useCallback(
    (currentPage: number, hasMore: boolean) => {
      if (prefetchNextPage && hasMore) {
        void prefetchPage(currentPage + 1);
      }
    },
    [prefetchNextPage, prefetchPage],
  );

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
        const res = await fetch(buildFetchUrl(page), {
          signal: abortController.signal,
        });
        const data = await res.json();
        const parsed = parseFetchResponse(data);

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
    [buildFetchUrl, parseFetchResponse, endpoint, schedulePrefetch],
  );

  useEffect(() => {
    prefetchCacheRef.current.clear();
    prefetchInFlightRef.current = null;
    prefetchAbortRef.current?.abort();
  }, [serializedParams]);

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
      prefetchAbortRef.current?.abort();
    };
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;
    const cached = prefetchCacheRef.current.get(nextPage);

    if (cached) {
      prefetchCacheRef.current.delete(nextPage);
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
