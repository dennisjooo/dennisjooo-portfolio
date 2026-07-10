import { NextResponse } from "next/server";
import { db, gallery, galleryDate } from "@/lib/db";
import { desc, asc, count } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
  buildPagination,
} from "@/lib/api/apiHelpers";
import { withCacheHeaders } from "@/lib/constants/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);

    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder") === "asc" ? asc : desc;

    let orderByClause = desc(galleryDate);

    if (sortByParam) {
      if (sortByParam === "title")
        orderByClause = sortOrderParam(gallery.title);
      else if (sortByParam === "dateTaken")
        orderByClause = sortOrderParam(galleryDate);
      else if (sortByParam === "createdAt")
        orderByClause = sortOrderParam(gallery.createdAt);
      else if (sortByParam === "updatedAt")
        orderByClause = sortOrderParam(gallery.updatedAt);
    }

    const [results, totalResult] = await Promise.all([
      db
        .select()
        .from(gallery)
        .orderBy(orderByClause)
        .offset(offset)
        .limit(limit),
      db.select({ count: count() }).from(gallery),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const response = NextResponse.json({
      success: true,
      data: results,
      pagination: buildPagination(total, page, limit),
    });
    return withCacheHeaders(response);
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return errorResponse("Failed to fetch gallery images");
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const [item] = await db.insert(gallery).values(body).returning();
    return successResponse(item, 201);
  } catch (error) {
    console.error("Failed to create gallery image:", error);
    return errorResponse("Failed to create gallery image");
  }
}
