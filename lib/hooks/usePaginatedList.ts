import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import type { PaginationResult } from '@/lib/data/blogs';

interface PaginationState {
    page: number;
    hasMore: boolean;
    total: number;
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
}

const EMPTY_QUERY_PARAMS: Record<string, string | number | boolean> = {};

export function usePaginatedList<T>({
    endpoint,
    pageSize,
    initialData,
    initialPagination,
    queryParams,
    resolveData,
    dataKey = 'data',
    paginationKey = 'pagination'
}: UsePaginatedListOptions<T>) {
    const serializedParams = queryParams ? JSON.stringify(queryParams) : '';

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

    const fetchItems = useCallback(async (page: number, reset = false) => {
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
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pageSize.toString());

            Object.entries(stableQueryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });

            const res = await fetch(`${endpoint}?${params.toString()}`, {
                signal: abortController.signal
            });
            const data = await res.json();

            const newItems = resolveData ? resolveData(data) : (data[dataKey] || []);
            const paginationData = data[paginationKey];

            setItems(prev => reset ? newItems : [...prev, ...newItems]);

            if (paginationData) {
                setPagination({
                    page: paginationData.page,
                    hasMore: paginationData.hasMore,
                    total: paginationData.total,
                });
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error(`Failed to fetch items from ${endpoint}`, error);
            }
        } finally {
            if (!abortController.signal.aborted) {
                setLoading(false);
                setLoadingMore(false);
            }
        }
    }, [endpoint, pageSize, stableQueryParams, resolveData, dataKey, paginationKey]);

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
        return () => {
            fetchAbortRef.current?.abort();
        };
    }, []);

    const loadMore = useCallback(() => {
        if (!loadingMore && pagination.hasMore) {
            fetchItems(pagination.page + 1);
        }
    }, [fetchItems, loadingMore, pagination.hasMore, pagination.page]);

    const sentinelRef = useInfiniteScroll({
        onLoadMore: loadMore,
        hasMore: pagination.hasMore,
        isLoading: loadingMore,
        rootMargin: '200px',
    });

    return {
        items,
        loading,
        loadingMore,
        pagination,
        sentinelRef
    };
}
