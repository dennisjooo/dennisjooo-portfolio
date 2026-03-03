import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

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
  result: { userId: string } | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
