import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { desc, count, eq } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const typeParam = searchParams.get("type");
    const offset = (page - 1) * limit;

    // Validate type parameter
    const validTypes = ["blog", "project"] as const;
    const type = typeParam && validTypes.includes(typeParam as typeof validTypes[number])
      ? (typeParam as "blog" | "project")
      : null;

    // Build query with optional type filter
    const baseQuery = type 
      ? db.select().from(blogs).where(eq(blogs.type, type))
      : db.select().from(blogs);
    
    const countQuery = type
      ? db.select({ count: count() }).from(blogs).where(eq(blogs.type, type))
      : db.select({ count: count() }).from(blogs);

    // Execute queries in parallel
    const [blogResults, totalResult] = await Promise.all([
      baseQuery.orderBy(desc(blogs.date)).offset(offset).limit(limit),
      countQuery,
    ]);

    const total = totalResult[0]?.count ?? 0;

    return withCacheHeaders(
      NextResponse.json({
        data: blogResults,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasMore: page < Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [blog] = await db.insert(blogs).values(body).returning();
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
