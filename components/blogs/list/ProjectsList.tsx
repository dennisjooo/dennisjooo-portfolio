import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { formatProjectDate } from "@/lib/utils/projectFormatting";
import { ContentCard, PaginatedList } from "@/components/shared";
import { FeaturedCard } from "./FeaturedCard";
import { BlogsListSkeleton } from "./skeletons";
import type { BlogListItem, PaginationResult } from "@/lib/data/blogs";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { useMemo } from "react";

const PAGE_SIZE = 7;

interface ProjectsListProps {
  type?: "project" | "blog" | "all";
  initialData?: BlogListItem[];
  initialPagination?: PaginationResult;
}

function LoadMoreFallback() {
  return (
    <div
      className="flex justify-center py-6"
      aria-busy="true"
      aria-label="Loading more posts"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
    </div>
  );
}

export default function ProjectsList({
  type = "project",
  initialData,
  initialPagination,
}: ProjectsListProps) {
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {};
    if (type !== "all") {
      params.type = type;
    }
    return params;
  }, [type]);

  const paginatedList = usePaginatedList<BlogListItem>({
    endpoint: "/api/blogs",
    pageSize: PAGE_SIZE,
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
        ? "No articles found"
        : "No projects found";

  const featuredItem = paginatedList.items[0];
  const remainingItems = paginatedList.items.slice(1);

  if (paginatedList.loading) {
    return <BlogsListSkeleton gridCount={PAGE_SIZE - 1} />;
  }

  return (
    <div className="w-full">
      {featuredItem && (
        <FeaturedCard
          title={featuredItem.title}
          description={featuredItem.description}
          slug={featuredItem.slug || createUrlSlug(featuredItem.title)}
          date={formatProjectDate(featuredItem.date, true)}
          imageUrl={featuredItem.imageUrl ?? undefined}
          type={featuredItem.type}
          readTime={`${featuredItem.readTimeMinutes} min`}
        />
      )}

      <PaginatedList
        {...paginatedList}
        items={remainingItems}
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
            slug={slug || createUrlSlug(title)}
            date={formatProjectDate(date, true)}
            imageUrl={imageUrl ?? undefined}
            index={index}
            type={itemType}
            readTime={`${readTimeMinutes} min`}
            variant="standard"
          />
        )}
      />
    </div>
  );
}
