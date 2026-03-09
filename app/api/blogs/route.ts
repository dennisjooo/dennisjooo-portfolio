import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { desc, count, eq, and, ilike, not, like } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";
import { auth } from "@clerk/nextjs/server";
import { visibleBlogsFilter } from "@/lib/data/blogs";
import { validateAndPrepareBlogBody } from "@/lib/api/blogHelpers";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
  buildPagination,
} from "@/lib/api/apiHelpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const searchQuery = searchParams.get("q");

    const validTypes = ["blog", "project"] as const;
    const type = typeParam && validTypes.includes(typeParam as typeof validTypes[number])
      ? (typeParam as "blog" | "project")
      : null;

    const { userId } = await auth();
    const validStatuses = ["draft", "scheduled", "published"] as const;
    const adminStatus = userId && statusParam && validStatuses.includes(statusParam as typeof validStatuses[number])
      ? (statusParam as "draft" | "scheduled" | "published")
      : null;

    const conditions = [];
    if (type) conditions.push(eq(blogs.type, type));
    if (searchQuery) conditions.push(ilike(blogs.title, `%${searchQuery}%`));
    conditions.push(not(like(blogs.slug, '%-preview')));

    if (adminStatus) {
      conditions.push(eq(blogs.status, adminStatus));
    } else if (!userId) {
      conditions.push(visibleBlogsFilter());
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = whereClause
      ? db.select().from(blogs).where(whereClause)
      : db.select().from(blogs);

    const countQuery = whereClause
      ? db.select({ count: count() }).from(blogs).where(whereClause)
      : db.select({ count: count() }).from(blogs);

    const [blogResults, totalResult] = await Promise.all([
      baseQuery.orderBy(desc(blogs.date)).offset(offset).limit(limit),
      countQuery,
    ]);

    const total = totalResult[0]?.count ?? 0;

    return withCacheHeaders(
      NextResponse.json({
        success: true,
        data: blogResults,
        pagination: buildPagination(total, page, limit),
      })
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return errorResponse("Failed to fetch blogs", 500);
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    const validationError = validateAndPrepareBlogBody(body, { defaultStatus: "draft" });
    if (validationError) return validationError;

    const [blog] = await db.insert(blogs).values(body).returning();
    return successResponse(blog, 201);
  } catch (error) {
    console.error("Error creating blog:", error);
    return errorResponse("Failed to create blog", 500);
  }
}
