import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { desc, count, eq, and } from "drizzle-orm";
import { withCacheHeaders } from "@/lib/constants/cache";
import { auth } from "@clerk/nextjs/server";
import { visibleBlogsFilter } from "@/lib/data/blogs";
import { createUrlSlug } from "@/lib/utils/urlHelpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const offset = (page - 1) * limit;

    const validTypes = ["blog", "project"] as const;
    const type = typeParam && validTypes.includes(typeParam as typeof validTypes[number])
      ? (typeParam as "blog" | "project")
      : null;

    // Admin can filter by status; public requests always get visibility filter
    const { userId } = await auth();
    const validStatuses = ["draft", "scheduled", "published"] as const;
    const adminStatus = userId && statusParam && validStatuses.includes(statusParam as typeof validStatuses[number])
      ? (statusParam as "draft" | "scheduled" | "published")
      : null;

    const conditions = [];
    if (type) conditions.push(eq(blogs.type, type));

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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.status) {
      body.status = "draft";
    }

    if (body.status === "scheduled") {
      if (!body.publishAt) {
        return NextResponse.json(
          { error: "publishAt is required for scheduled posts" },
          { status: 400 }
        );
      }
      if (new Date(body.publishAt) <= new Date()) {
        return NextResponse.json(
          { error: "publishAt must be a future date" },
          { status: 400 }
        );
      }
    }

    if (body.publishAt) {
      body.publishAt = new Date(body.publishAt);
    }

    if (!body.slug && body.title) {
      body.slug = createUrlSlug(body.title);
    }

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
