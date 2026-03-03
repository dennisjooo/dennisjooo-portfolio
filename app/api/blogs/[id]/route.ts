import { NextResponse } from "next/server";
import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { cachedJsonResponse } from "@/lib/constants/cache";
import { del } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { createUrlSlug } from "@/lib/utils/urlHelpers";
import { migrateAllBlogImages } from "@/lib/utils/blobMigration";

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
      "status",
      "publishAt",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    const unexpectedKeys = Object.keys(body).filter(
      (key) => !allowedFields.includes(key as (typeof allowedFields)[number])
    );
    if (unexpectedKeys.length > 0) {
      return NextResponse.json(
        { error: `Unexpected fields: ${unexpectedKeys.join(", ")}` },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    if (updateData.status === "scheduled") {
      if (!updateData.publishAt) {
        return NextResponse.json(
          { error: "publishAt is required for scheduled posts" },
          { status: 400 }
        );
      }
      if (new Date(updateData.publishAt as string) <= new Date()) {
        return NextResponse.json(
          { error: "publishAt must be a future date" },
          { status: 400 }
        );
      }
    }

    if (updateData.publishAt) {
      updateData.publishAt = new Date(updateData.publishAt as string);
    }

    if (!updateData.slug && updateData.title) {
      updateData.slug = createUrlSlug(updateData.title as string);
    }

    // Migrate blob images when slug changes
    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, id));

    if (!existingBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const newSlug =
      (updateData.slug as string | undefined) || existingBlog.slug;
    const oldSlug = existingBlog.slug;

    if (newSlug && newSlug !== oldSlug) {
      const currentImageUrl =
        (updateData.imageUrl as string | undefined) ?? existingBlog.imageUrl;
      const currentBlogPost =
        (updateData.blogPost as string | undefined) ?? existingBlog.blogPost;

      try {
        const migrated = await migrateAllBlogImages(
          newSlug,
          currentImageUrl,
          currentBlogPost
        );

        if (migrated.migrated > 0) {
          updateData.imageUrl = migrated.imageUrl;
          updateData.blogPost = migrated.blogPost;
        }
      } catch (err) {
        console.error("Image migration failed (saving anyway):", err);
      }
    }

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

