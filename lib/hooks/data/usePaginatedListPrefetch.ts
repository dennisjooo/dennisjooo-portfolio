import { useCallback, useRef } from "react";
import {
  type PrefetchedPage,
  type PaginationState,
  buildPaginatedFetchUrl,
  parsePaginatedResponse,
} from "./paginatedListUtils";

interface UsePaginatedListPrefetchOptions<T> {
  endpoint: string;
  pageSize: number;
  stableQueryParams: Record<string, string | number | boolean>;
  prefetchNextPage: boolean;
  resolveData?: (data: Record<string, unknown>) => T[];
  dataKey: string;
  paginationKey: string;
}

export function usePaginatedListPrefetch<T>({
  endpoint,
  pageSize,
  stableQueryParams,
  prefetchNextPage,
  resolveData,
  dataKey,
  paginationKey,
}: UsePaginatedListPrefetchOptions<T>) {
  const prefetchAbortRef = useRef<AbortController | null>(null);
  const prefetchCacheRef = useRef<Map<number, PrefetchedPage<T>>>(new Map());
  const prefetchInFlightRef = useRef<number | null>(null);

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
    [
      prefetchNextPage,
      endpoint,
      pageSize,
      stableQueryParams,
      resolveData,
      dataKey,
      paginationKey,
    ],
  );

  const schedulePrefetch = useCallback(
    (currentPage: number, hasMore: boolean) => {
      if (prefetchNextPage && hasMore) {
        void prefetchPage(currentPage + 1);
      }
    },
    [prefetchNextPage, prefetchPage],
  );

  const clearPrefetchCache = useCallback(() => {
    prefetchCacheRef.current.clear();
    prefetchInFlightRef.current = null;
    prefetchAbortRef.current?.abort();
  }, []);

  const consumePrefetchedPage = useCallback(
    (page: number): PrefetchedPage<T> | undefined => {
      const cached = prefetchCacheRef.current.get(page);
      if (cached) {
        prefetchCacheRef.current.delete(page);
      }
      return cached;
    },
    [],
  );

  const abortPrefetch = useCallback(() => {
    prefetchAbortRef.current?.abort();
  }, []);

  return {
    prefetchPage,
    schedulePrefetch,
    clearPrefetchCache,
    consumePrefetchedPage,
    abortPrefetch,
  };
}

export type { PaginationState };
