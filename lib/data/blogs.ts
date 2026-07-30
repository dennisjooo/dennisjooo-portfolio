import "server-only";
import { unstable_cache } from "next/cache";
import { db, blogs, type Blog } from "@/lib/db";
import { eq, desc, and, type SQL } from "drizzle-orm";
import { CACHE_CONFIG } from "@/lib/constants/cache";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { buildPagination } from "@/lib/api/apiHelpers";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import { queryPublicBlogListItems } from "@/lib/db/blogQueries";

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
      const { rows, total } = await queryPublicBlogListItems(page, limit, type);

      return {
        data: rows,
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
