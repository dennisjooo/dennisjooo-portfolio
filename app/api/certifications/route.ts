import { db, certifications } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { desc, count } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

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
    return NextResponse.json(
      { success: false, error: "Failed to fetch certifications" },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const [cert] = await db.insert(certifications).values(body).returning();
    return NextResponse.json({ success: true, data: cert }, { status: 201 });
  } catch (error) {
    console.error("Failed to create certification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create certification" },
      { status: 400 }
    );
  }
}
