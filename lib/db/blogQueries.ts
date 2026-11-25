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
import { PREVIEW_SLUG_SUFFIX } from "@/lib/db/blogPreview";
import { calculateReadTime } from "@/lib/utils/projectFormatting";
import type { BlogListItem } from "@/lib/types/blogList";

export type BlogListVisibility = "public" | "admin-all" | "admin-status";

export interface BlogListQueryParams {
  limit: number;
  offset: number;
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

export function buildBlogOrderBy(
  sortBy?: string | null,
  sortOrder: "asc" | "desc" = "desc",
) {
  const sortFn = sortOrder === "asc" ? asc : desc;

  if (sortBy === "title") return sortFn(blogs.title);
  if (sortBy === "type") return sortFn(blogs.type);
  if (sortBy === "status") return sortFn(blogs.status);
  if (sortBy === "createdAt") return sortFn(blogs.createdAt);
  if (sortBy === "updatedAt") return sortFn(blogs.updatedAt);

  return desc(blogs.date);
}

export async function queryBlogList(params: BlogListQueryParams) {
  const whereClause = buildBlogWhereClause(params);
  const orderByClause = buildBlogOrderBy(
    params.sortBy,
    params.sortOrder ?? "desc",
  );

  const baseQuery = whereClause
    ? db.select().from(blogs).where(whereClause)
    : db.select().from(blogs);

  const countQuery = whereClause
    ? db.select({ count: count() }).from(blogs).where(whereClause)
    : db.select({ count: count() }).from(blogs);

  const [rows, totalResult] = await Promise.all([
    baseQuery.orderBy(orderByClause).offset(params.offset).limit(params.limit),
    countQuery,
  ]);

  return {
    rows: rows as Blog[],
    total: totalResult[0]?.count ?? 0,
  };
}

export async function queryPublicBlogListItems(
  page: number,
  limit: number,
  type?: "blog" | "project" | "all",
) {
  const { rows, total } = await queryBlogList({
    limit,
    offset: (page - 1) * limit,
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
    total,
  };
}
