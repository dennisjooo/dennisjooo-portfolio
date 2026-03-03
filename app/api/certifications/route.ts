import { db, certifications } from "@/lib/db";
import { NextResponse } from "next/server";
import { desc, count } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
  parsePagination,
} from "@/lib/api/apiHelpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(searchParams);

    const [certs, totalResult] = await Promise.all([
      db
        .select()
        .from(certifications)
        .orderBy(desc(certifications.date))
        .offset(offset)
        .limit(limit),
      db.select({ count: count() }).from(certifications),
    ]);

    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return withCacheHeaders(
      NextResponse.json({
        success: true,
        data: certs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages,
        },
      })
    );
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return errorResponse("Failed to fetch certifications");
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();
    const [cert] = await db.insert(certifications).values(body).returning();
    return successResponse(cert, 201);
  } catch (error) {
    console.error("Failed to create certification:", error);
    return errorResponse("Failed to create certification");
  }
}
