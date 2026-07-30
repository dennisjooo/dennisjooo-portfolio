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
import { calculateReadTime } from "@/lib/utils/projectFormatting";

export type BlogListVisibility =
  "public" | "admin-all" | "admin-status" | "custom";

export interface BlogListQueryParams {
  page: number;
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

export const blogListSelect = {
  id: blogs.id,
  title: blogs.title,
  description: blogs.description,
  imageUrl: blogs.imageUrl,
  date: blogs.date,
  type: blogs.type,
  slug: blogs.slug,
  blogPost: blogs.blogPost,
};

export function toBlogListItem(row: {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
  type: "project" | "blog";
  slug: string | null;
  blogPost: string;
}) {
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
  const conditions: SQL[] = [not(like(blogs.slug, "%-preview"))];

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
  const offset = (page - 1) * limit;
  const whereClause = buildBlogWhereClause({ type, visibility: "public" });

  const baseQuery = db.select(blogListSelect).from(blogs).where(whereClause!);
  const countQuery = db
    .select({ count: count() })
    .from(blogs)
    .where(whereClause!);

  const [rows, totalResult] = await Promise.all([
    baseQuery.orderBy(desc(blogs.date)).offset(offset).limit(limit),
    countQuery,
  ]);

  return {
    rows: rows.map(toBlogListItem),
    total: totalResult[0]?.count ?? 0,
  };
}
