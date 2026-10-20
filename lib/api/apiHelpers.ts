import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

const CONTENT_TAGS = [
  "blogs",
  "projects",
  "site-config",
  "work-experience",
  "contacts",
];

// ponytail: invalidates every content tag; per-entity tags if rebuilds get costly
export function mutationResponse(data: unknown, status = 200) {
  CONTENT_TAGS.forEach((tag) => revalidateTag(tag, { expire: 0 }));
  return successResponse(data, status);
}

export const NO_STORE_HEADERS = { "Cache-Control": "private, no-store" };

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function requireAuth(): Promise<
  { userId: string } | NextResponse
> {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }
  return { userId };
}

export function isAuthError(
  result: { userId: string } | NextResponse,
): result is NextResponse {
  return result instanceof NextResponse;
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPagination(total: number, page: number, limit: number) {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages, hasMore: page < totalPages };
}
