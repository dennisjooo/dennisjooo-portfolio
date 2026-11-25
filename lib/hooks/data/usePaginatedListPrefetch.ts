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
  const prefetchCacheRef = useRef<Map<string, PrefetchedPage<T>>>(new Map());
  const prefetchInFlightRef = useRef<string | null>(null);

  const prefetchPage = useCallback(
    async (cursor: string | null) => {
      if (!prefetchNextPage || !cursor) return;
      if (prefetchCacheRef.current.has(cursor)) return;
      if (prefetchInFlightRef.current === cursor) return;

      prefetchAbortRef.current?.abort();
      const abortController = new AbortController();
      prefetchAbortRef.current = abortController;
      prefetchInFlightRef.current = cursor;

      try {
        const res = await fetch(
          buildPaginatedFetchUrl(endpoint, cursor, pageSize, stableQueryParams),
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
          prefetchCacheRef.current.set(cursor, {
            items: parsed.items,
            pagination: parsed.pagination,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(`Failed to prefetch ${endpoint}`, error);
        }
      } finally {
        if (prefetchInFlightRef.current === cursor) {
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
    (nextCursor: string | null, hasMore: boolean) => {
      if (prefetchNextPage && hasMore) {
        void prefetchPage(nextCursor);
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
    (cursor: string | null): PrefetchedPage<T> | undefined => {
      const cached = cursor ? prefetchCacheRef.current.get(cursor) : undefined;
      if (cursor && cached) {
        prefetchCacheRef.current.delete(cursor);
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
