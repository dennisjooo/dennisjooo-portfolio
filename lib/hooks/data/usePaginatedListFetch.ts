import { useCallback, useRef } from "react";
import {
  buildPaginatedFetchUrl,
  parsePaginatedResponse,
  type PaginationState,
} from "./paginatedListUtils";

interface UsePaginatedListFetchOptions<T> {
  endpoint: string;
  pageSize: number;
  stableQueryParams: Record<string, string | number | boolean>;
  resolveData?: (data: Record<string, unknown>) => T[];
  dataKey: string;
  paginationKey: string;
  schedulePrefetch: (nextCursor: string | null, hasMore: boolean) => void;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
}

export function usePaginatedListFetch<T>({
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
}: UsePaginatedListFetchOptions<T>) {
  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(
    async (cursor: string | null, reset = false) => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }

      const abortController = new AbortController();
      fetchAbortRef.current = abortController;

      if (!cursor) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

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

        setItems((prev) => (reset ? parsed.items : [...prev, ...parsed.items]));

        if (parsed.pagination) {
          setPagination(parsed.pagination);
          schedulePrefetch(
            parsed.pagination.nextCursor,
            parsed.pagination.hasMore,
          );
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
      setItems,
      setPagination,
      setLoading,
      setLoadingMore,
    ],
  );

  const abortFetch = useCallback(() => {
    fetchAbortRef.current?.abort();
  }, []);

  return { fetchItems, abortFetch };
}
