import "server-only";
import { unstable_cache } from "next/cache";
import { db, blogs, type Blog } from "@/lib/db";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/constants/cache";
import {
  FEATURED_POST_COUNT,
  PUBLIC_LIST_PAGE_SIZE,
} from "@/lib/constants/blogsList";
import { queryPublicBlogListItems, toBlogListItem } from "@/lib/db/blogQueries";
import { resolveBlogSlug } from "@/lib/utils/urlHelpers";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import type { BlogType } from "@/lib/types/blog";
import type { BlogListItem } from "@/lib/types/blogList";
import type { PaginationResult } from "@/lib/types/pagination";

export interface BlogsResult {
  data: BlogListItem[];
  pagination: PaginationResult;
}

export async function findBlogBySlug(
  slug: string,
  filter?: SQL,
): Promise<Blog | null> {
  const whereClause = filter
    ? and(eq(blogs.slug, slug), filter)
    : eq(blogs.slug, slug);

  const [match] = await db.select().from(blogs).where(whereClause);
  if (match) return match;

  const allSlugs = await db
    .select({ id: blogs.id, title: blogs.title, slug: blogs.slug })
    .from(blogs)
    .where(filter);

  const fallback = allSlugs.find(
    (row) => resolveBlogSlug(row.title, row.slug) === slug,
  );

  if (fallback) {
    const [fullRow] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, fallback.id));
    return fullRow ?? null;
  }

  return null;
}

export const getFeaturedProjects = unstable_cache(
  async (): Promise<BlogListItem[]> => {
    try {
      const rows = await db
        .select()
        .from(blogs)
        .where(visibleBlogsFilter())
        .orderBy(desc(blogs.date), desc(blogs.id))
        .limit(FEATURED_POST_COUNT);
      return rows.map(toBlogListItem);
    } catch (error) {
      console.error("Failed to fetch featured posts", error);
      return [];
    }
  },
  ["featured-projects"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.blogs] },
);

export const getBlogs = unstable_cache(
  async (
    cursor: string | null = null,
    limit: number = PUBLIC_LIST_PAGE_SIZE,
    type?: BlogType | "all",
  ): Promise<BlogsResult> => {
    try {
      const { rows, total, hasMore, nextCursor } =
        await queryPublicBlogListItems(cursor, limit, type);

      return {
        data: rows,
        pagination: { total, limit, hasMore, nextCursor },
      };
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      return {
        data: [],
        pagination: { total: 0, limit, hasMore: false, nextCursor: null },
      };
    }
  },
  ["blogs-list"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.blogs] },
);

export const getPublishedBlogBySlug = unstable_cache(
  (slug: string) => findBlogBySlug(slug, visibleBlogsFilter()),
  ["blog-by-slug"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.blogs] },
);
