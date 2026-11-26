import { formatProjectDate } from "@/lib/utils/projectFormatting";
import { ContentCard, PaginatedList } from "@/components/shared";
import { InlineSpinner } from "@/components/shared/feedback/InlineSpinner";
import { FeaturedCard } from "./FeaturedCard";
import { BlogsListSkeleton } from "./skeletons";
import type { BlogListItem } from "@/lib/types/blogList";
import type { PaginationResult } from "@/lib/types/pagination";
import { usePaginatedList } from "@/lib/hooks/data/usePaginatedList";
import { useMemo } from "react";

import { PUBLIC_LIST_PAGE_SIZE } from "@/lib/constants/blogsList";

interface BlogsListProps {
  type?: "project" | "blog" | "all";
  initialData?: BlogListItem[];
  initialPagination?: PaginationResult;
}

function LoadMoreFallback() {
  return <InlineSpinner label="Loading more posts" />;
}

export default function BlogsList({
  type = "project",
  initialData,
  initialPagination,
}: BlogsListProps) {
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {};
    if (type !== "all") {
      params.type = type;
    }
    return params;
  }, [type]);

  const paginatedList = usePaginatedList<BlogListItem>({
    endpoint: "/api/blogs",
    pageSize: PUBLIC_LIST_PAGE_SIZE,
    initialData,
    initialPagination,
    queryParams,
    prefetchNextPage: true,
    infiniteScrollRootMargin: "800px",
  });

  const emptyMessage =
    type === "all"
      ? "No content found"
      : type === "blog"
        ? "No writing yet"
        : "No projects found";

  const [featuredItem, ...gridItems] = paginatedList.items;

  if (paginatedList.loading) {
    return <BlogsListSkeleton gridCount={PUBLIC_LIST_PAGE_SIZE - 1} />;
  }

  return (
    <div className="w-full">
      {featuredItem && (
        <div className="mb-8 md:mb-16">
          <FeaturedCard
            wide
            title={featuredItem.title}
            description={featuredItem.description}
            slug={featuredItem.slug}
            date={formatProjectDate(featuredItem.date, true)}
            imageUrl={featuredItem.imageUrl ?? undefined}
            displayIndex={1}
            type={featuredItem.type}
            readTime={`${featuredItem.readTimeMinutes} min`}
          />
        </div>
      )}

      {(gridItems.length > 0 || !featuredItem) && (
        <PaginatedList
          {...paginatedList}
          items={gridItems}
          gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          emptyMessage={emptyMessage}
          loadingMoreSkeleton={<LoadMoreFallback />}
          keyExtractor={(p) => `${p.title}_${p.date}`}
          renderItem={(
            {
              title,
              description,
              date,
              imageUrl,
              type: itemType,
              slug,
              readTimeMinutes,
            },
            index,
          ) => (
            <ContentCard
              title={title}
              description={description}
              slug={slug}
              date={formatProjectDate(date, true)}
              imageUrl={imageUrl ?? undefined}
              index={index}
              displayIndex={index + 2}
              type={itemType}
              readTime={`${readTimeMinutes} min`}
            />
          )}
        />
      )}
    </div>
  );
}
