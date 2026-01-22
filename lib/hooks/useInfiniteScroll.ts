import { useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /** Callback to load more items */
  onLoadMore: () => void;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
}

/**
 * Hook for implementing infinite scroll pagination
 * Returns a ref to attach to the sentinel element at the bottom of the list
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '100px',
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node) {
        const observer = new IntersectionObserver(handleObserver, {
          rootMargin,
          threshold,
        });
        observer.observe(node);
        observerRef.current = observer;
      }
    },
    [handleObserver, rootMargin, threshold]
  );

  return ref;
}
