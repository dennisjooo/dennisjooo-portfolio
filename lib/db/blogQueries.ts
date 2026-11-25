import { db, blogs, type Blog } from "@/lib/db";
import {
  eq,
  desc,
  asc,
  count,
  and,
  ilike,
  not,
  like,
  type SQL,
} from "drizzle-orm";
import { visibleBlogsFilter } from "@/lib/db/blogFilters";
import { keysetWhere, sliceCursorPage } from "@/lib/api/cursor";
import { PREVIEW_SLUG_SUFFIX } from "@/lib/db/blogPreview";
import { calculateReadTime } from "@/lib/utils/projectFormatting";
import type { BlogListItem } from "@/lib/types/blogList";

export type BlogListVisibility = "public" | "admin-all" | "admin-status";

export interface BlogListQueryParams {
  limit: number;
  cursor?: string | null;
  type?: "blog" | "project" | "all" | null;
  status?: "draft" | "scheduled" | "published" | null;
  searchQuery?: string | null;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
  visibility?: BlogListVisibility;
  isAuthenticated?: boolean;
}

export function toBlogListItem(row: {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: BlogListItem["type"];
  slug: string | null;
  blogPost: string;
}): BlogListItem {
  const { blogPost, ...rest } = row;
  return {
    ...rest,
    readTimeMinutes: calculateReadTime(blogPost),
  };
}

export function buildBlogWhereClause({
  type,
  status,
  searchQuery,
  visibility = "public",
  isAuthenticated = false,
}: Pick<
  BlogListQueryParams,
  "type" | "status" | "searchQuery" | "visibility" | "isAuthenticated"
>): SQL | undefined {
  const conditions: SQL[] = [not(like(blogs.slug, `%${PREVIEW_SLUG_SUFFIX}`))];

  const effectiveType = type === "all" ? null : type;
  if (effectiveType) {
    conditions.push(eq(blogs.type, effectiveType));
  }

  if (searchQuery) {
    conditions.push(ilike(blogs.title, `%${searchQuery}%`));
  }

  if (
    visibility === "public" ||
    (!isAuthenticated && visibility !== "admin-all")
  ) {
    conditions.push(visibleBlogsFilter());
  } else if (visibility === "admin-status" && status) {
    conditions.push(eq(blogs.status, status));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

const BLOG_SORT_COLUMNS = {
  title: blogs.title,
  type: blogs.type,
  status: blogs.status,
  createdAt: blogs.createdAt,
  updatedAt: blogs.updatedAt,
  date: blogs.date,
} as const;

export async function queryBlogList(params: BlogListQueryParams) {
  const sortKey =
    params.sortBy && params.sortBy in BLOG_SORT_COLUMNS
      ? (params.sortBy as keyof typeof BLOG_SORT_COLUMNS)
      : "date";
  const dir = params.sortBy ? (params.sortOrder ?? "desc") : "desc";
  const sortFn = dir === "asc" ? asc : desc;
  const sortCol = BLOG_SORT_COLUMNS[sortKey];

  const whereClause = buildBlogWhereClause(params);
  const pageWhere = and(
    whereClause,
    keysetWhere(sortCol, blogs.id, dir, params.cursor ?? null),
  );

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(blogs)
      .where(pageWhere)
      .orderBy(sortFn(sortCol), sortFn(blogs.id))
      .limit(params.limit + 1),
    db.select({ count: count() }).from(blogs).where(whereClause),
  ]);

  const page = sliceCursorPage(rows, params.limit, sortKey);
  return {
    rows: page.rows as Blog[],
    total: totalResult[0]?.count ?? 0,
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
  };
}

export async function queryPublicBlogListItems(
  cursor: string | null,
  limit: number,
  type?: "blog" | "project" | "all",
) {
  const { rows, ...rest } = await queryBlogList({
    limit,
    cursor,
    type,
    visibility: "public",
  });

  return {
    rows: rows.map((row) =>
      toBlogListItem({
        id: row.id,
        title: row.title,
        description: row.description,
        imageUrl: row.imageUrl,
        date: row.date,
        type: row.type,
        slug: row.slug,
        blogPost: row.blogPost,
      }),
    ),
    ...rest,
  };
}
