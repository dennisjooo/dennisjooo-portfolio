import "server-only";
import { unstable_cache } from "next/cache";
import { db, blogs, type Blog } from "@/lib/db";
import { eq, desc, count, and, not, like, type SQL } from "drizzle-orm";
import { CACHE_CONFIG } from "@/lib/constants/cache";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { buildPagination } from "@/lib/api/apiHelpers";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import { calculateReadTime } from "@/lib/utils/projectFormatting";

export { visibleBlogsFilter };

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface BlogListItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: "project" | "blog";
  slug: string | null;
  readTimeMinutes: number;
}

export interface BlogsResult {
  data: BlogListItem[];
  pagination: PaginationResult;
}

function toBlogListItem(row: {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: "project" | "blog";
  slug: string | null;
  blogPost: string;
}): BlogListItem {
  const { blogPost, ...rest } = row;
  return {
    ...rest,
    readTimeMinutes: calculateReadTime(blogPost),
  };
}

export async function findBlogBySlug(
  slug: string,
  filter?: SQL,
): Promise<Blog | null> {
  const whereClause = filter
    ? and(eq(blogs.slug, slug), filter)
    : eq(blogs.slug, slug);

  const [project] = await db.select().from(blogs).where(whereClause);
  if (project) return project;

  const allSlugs = await db
    .select({ id: blogs.id, title: blogs.title, slug: blogs.slug })
    .from(blogs)
    .where(filter);

  const match = allSlugs.find(
    (p) => createUrlSlug(p.title) === slug || p.slug === slug,
  );

  if (match) {
    const [fullProject] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, match.id));
    return fullProject ?? null;
  }

  return null;
}

export const getFeaturedProjects = unstable_cache(
  async (): Promise<Blog[]> => {
    try {
      const projects = await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.type, "project"), visibleBlogsFilter()))
        .orderBy(desc(blogs.date))
        .limit(3);
      return projects;
    } catch (error) {
      console.error("Failed to fetch featured projects", error);
      return [];
    }
  },
  ["featured-projects"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["projects", "blogs"] },
);

export const getBlogs = unstable_cache(
  async (
    page: number = 1,
    limit: number = 9,
    type?: "blog" | "project" | "all",
  ): Promise<BlogsResult> => {
    try {
      const offset = (page - 1) * limit;
      const effectiveType = type === "all" ? null : type;

      const visibilityFilter = and(
        visibleBlogsFilter(),
        not(like(blogs.slug, "%-preview")),
      );

      const whereClause = effectiveType
        ? and(eq(blogs.type, effectiveType), visibilityFilter)
        : visibilityFilter;

      const listSelect = {
        id: blogs.id,
        title: blogs.title,
        description: blogs.description,
        imageUrl: blogs.imageUrl,
        date: blogs.date,
        type: blogs.type,
        slug: blogs.slug,
        blogPost: blogs.blogPost,
      };

      const baseQuery = db.select(listSelect).from(blogs).where(whereClause);
      const countQuery = db
        .select({ count: count() })
        .from(blogs)
        .where(whereClause);

      const [blogResults, totalResult] = await Promise.all([
        baseQuery.orderBy(desc(blogs.date)).offset(offset).limit(limit),
        countQuery,
      ]);

      const total = totalResult[0]?.count ?? 0;

      return {
        data: blogResults.map(toBlogListItem),
        pagination: buildPagination(total, page, limit),
      };
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
          hasMore: false,
        },
      };
    }
  },
  ["blogs-list"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["blogs", "projects"] },
);
