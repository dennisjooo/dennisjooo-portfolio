import { NextResponse } from "next/server";
import { blogs } from "@/lib/db";
import { withCacheHeaders } from "@/lib/constants/cache";
import { auth } from "@clerk/nextjs/server";
import { getBlogs } from "@/lib/data/blogs";
import { validateAndPrepareBlogBody } from "@/lib/api/blogHelpers";
import { queryBlogList } from "@/lib/db/blogQueries";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
  buildPagination,
} from "@/lib/api/apiHelpers";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const searchQuery = searchParams.get("q");

    const validTypes = ["blog", "project"] as const;
    const type =
      typeParam && validTypes.includes(typeParam as (typeof validTypes)[number])
        ? (typeParam as "blog" | "project")
        : null;

    const { userId } = await auth();
    const validStatuses = ["draft", "scheduled", "published"] as const;
    const adminStatus =
      userId &&
      statusParam &&
      validStatuses.includes(statusParam as (typeof validStatuses)[number])
        ? (statusParam as "draft" | "scheduled" | "published")
        : null;

    if (!userId && !adminStatus && !searchQuery) {
      const result = await getBlogs(page, limit, type ?? "all");
      return withCacheHeaders(
        NextResponse.json({
          success: true,
          ...result,
        }),
      );
    }

    const sortOrderParam = searchParams.get("sortOrder");
    const { rows, total } = await queryBlogList({
      page,
      limit,
      offset,
      type,
      status: adminStatus,
      searchQuery,
      sortBy: searchParams.get("sortBy"),
      sortOrder: sortOrderParam === "asc" ? "asc" : "desc",
      visibility: adminStatus
        ? "admin-status"
        : userId
          ? "admin-all"
          : "public",
      isAuthenticated: Boolean(userId),
    });

    return withCacheHeaders(
      NextResponse.json({
        success: true,
        data: rows,
        pagination: buildPagination(total, page, limit),
      }),
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

    const validationError = validateAndPrepareBlogBody(body, {
      defaultStatus: "draft",
    });
    if (validationError) return validationError;

    const [blog] = await db.insert(blogs).values(body).returning();
    return successResponse(blog, 201);
  } catch (error) {
    console.error("Error creating blog:", error);
    return errorResponse("Failed to create blog", 500);
  }
}
