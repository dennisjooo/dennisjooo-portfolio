import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { formatProjectDate } from "@/lib/utils/projectFormatting";
import { ContentCard, PaginatedList } from "@/components/shared";
import { InlineSpinner } from "@/components/shared/feedback/InlineSpinner";
import { FeaturedCard } from "./FeaturedCard";
import { BlogsListSkeleton } from "./skeletons";
import type { BlogListItem, PaginationResult } from "@/lib/data/blogs";
import { usePaginatedList } from "@/lib/hooks/data/usePaginatedList";
import { useMemo } from "react";

const PAGE_SIZE = 9;

interface ProjectsListProps {
  type?: "project" | "blog" | "all";
  initialData?: BlogListItem[];
  initialPagination?: PaginationResult;
}

function LoadMoreFallback() {
  return <InlineSpinner label="Loading more posts" />;
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
        ? "No writing yet"
        : "No projects found";

  const [featuredItem, ...gridItems] = paginatedList.items;

  if (paginatedList.loading) {
    return <BlogsListSkeleton gridCount={PAGE_SIZE - 1} />;
  }

  return (
    <div className="w-full">
      {featuredItem && (
        <div className="mb-12 md:mb-16">
          <FeaturedCard
            wide
            title={featuredItem.title}
            description={featuredItem.description}
            slug={featuredItem.slug || createUrlSlug(featuredItem.title)}
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
              slug={slug || createUrlSlug(title)}
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
