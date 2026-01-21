import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { desc, count } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Execute queries in parallel
    const [blogResults, totalResult] = await Promise.all([
      db.select().from(blogs).orderBy(desc(blogs.date)).offset(offset).limit(limit),
      db.select({ count: count() }).from(blogs),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return NextResponse.json({
      data: blogResults,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
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
