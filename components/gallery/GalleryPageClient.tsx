"use client";

import { usePaginatedList } from "@/lib/hooks/data/usePaginatedList";
import type { GalleryListItem } from "@/lib/data/gallery";
import { GalleryMasonryGrid } from "./GalleryMasonryGrid";

const PAGE_SIZE = 12;

interface GalleryPageClientProps {
  initialImages: GalleryListItem[];
  initialPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function GalleryPageClient({
  initialImages,
  initialPagination,
}: GalleryPageClientProps) {
  const { items, loading, loadingMore, sentinelRef } =
    usePaginatedList<GalleryListItem>({
      endpoint: "/api/gallery",
      pageSize: PAGE_SIZE,
      initialData: initialImages,
      initialPagination,
      prefetchNextPage: true,
      infiniteScrollRootMargin: "600px",
    });

  return (
    <GalleryMasonryGrid
      images={items}
      loading={loading}
      loadingMore={loadingMore}
      sentinelRef={sentinelRef}
    />
  );
}
