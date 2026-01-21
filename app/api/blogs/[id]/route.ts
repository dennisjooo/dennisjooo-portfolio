import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { cachedJsonResponse } from "@/lib/constants/cache";
import { del } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return cachedJsonResponse(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Allowlist of mutable fields - reject any unexpected keys
    const allowedFields = [
      "title",
      "description",
      "imageUrl",
      "blogPost",
      "date",
      "type",
      "wordCount",
      "readTime",
      "links",
      "slug",
    ] as const;

    // Build sanitized update object with only allowed fields
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Check for unexpected keys
    const unexpectedKeys = Object.keys(body).filter(
      (key) => !allowedFields.includes(key as (typeof allowedFields)[number])
    );
    if (unexpectedKeys.length > 0) {
      return NextResponse.json(
        { error: `Unexpected fields: ${unexpectedKeys.join(", ")}` },
        { status: 400 }
      );
    }

    // Require at least one field to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Set updatedAt explicitly
    updateData.updatedAt = new Date();

    const [blog] = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, id))
      .returning();

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Fetch blog first to get image URLs for cleanup
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Collect all Vercel Blob images to delete
    const imagesToDelete: string[] = [];

    // Add cover image if it's a Vercel Blob URL
    if (blog.imageUrl?.includes('vercel-storage.com')) {
      imagesToDelete.push(blog.imageUrl);
    }

    // Extract inline images from markdown content
    const markdownImageRegex = /!\[.*?\]\((https:\/\/[^)]+vercel-storage\.com[^)]+)\)/g;
    let match;
    while ((match = markdownImageRegex.exec(blog.blogPost || '')) !== null) {
      imagesToDelete.push(match[1]);
    }

    // Delete from database
    await db.delete(blogs).where(eq(blogs.id, id));

    // Delete blobs (non-blocking, errors logged but not thrown)
    if (imagesToDelete.length > 0) {
      del(imagesToDelete).catch(err => console.error('Failed to delete blobs:', err));
    }

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

