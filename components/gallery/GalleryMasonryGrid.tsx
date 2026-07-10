"use client";

import { useMemo } from "react";
import { PhotoProvider } from "react-photo-view";
import { PHOTO_VIEWER_CONFIG } from "@/lib/constants/photoViewer";
import type { GalleryListItem } from "@/lib/data/gallery";
import { GalleryCard } from "./GalleryCard";
import { ListSkeleton, EmptyState } from "@/components/shared";
import { useMediaQuery } from "@/lib/hooks/ui/useMediaQuery";

interface GalleryMasonryGridProps {
  images: GalleryListItem[];
  loading: boolean;
  loadingMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
}

function GalleryLoadMoreFallback() {
  return (
    <div
      className="flex justify-center py-8"
      aria-busy="true"
      aria-label="Loading more images"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
    </div>
  );
}

/**
 * Distributes images across columns using a shortest-column-first algorithm.
 * Each image is placed into whichever column currently has the least cumulative
 * height (estimated from aspect ratios), producing a visually balanced layout.
 */
function distributeToColumns(
  images: GalleryListItem[],
  columnCount: number,
): GalleryListItem[][] {
  const columns: GalleryListItem[][] = Array.from(
    { length: columnCount },
    () => [],
  );
  const heights = new Float64Array(columnCount);

  for (const image of images) {
    const aspectRatio =
      image.width && image.height ? image.width / image.height : 4 / 3;
    const normalisedHeight = 1 / aspectRatio;

    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (heights[c] < heights[shortest]) shortest = c;
    }

    columns[shortest].push(image);
    heights[shortest] += normalisedHeight;
  }

  return columns;
}

export function GalleryMasonryGrid({
  images,
  loading,
  loadingMore,
  sentinelRef,
}: GalleryMasonryGridProps) {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const columnCount = isLg ? 3 : isSm ? 2 : 1;

  const columns = useMemo(
    () => distributeToColumns(images, columnCount),
    [images, columnCount],
  );

  if (loading) {
    return (
      <ListSkeleton
        count={9}
        height="h-56"
        gap="gap-4"
        cols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />
    );
  }

  if (images.length === 0) {
    return <EmptyState message="No gallery images yet." />;
  }

  return (
    <PhotoProvider
      maskOpacity={PHOTO_VIEWER_CONFIG.maskOpacity}
      speed={() => PHOTO_VIEWER_CONFIG.speed}
      overlayRender={({ overlay }) => <>{overlay}</>}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-5">
            {column.map((image) => (
              <GalleryCard
                key={image.id}
                image={image}
                index={images.indexOf(image)}
              />
            ))}
          </div>
        ))}
      </div>

      {loadingMore ? <GalleryLoadMoreFallback /> : null}
      <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
    </PhotoProvider>
  );
}
