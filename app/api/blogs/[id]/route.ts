import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { cachedJsonResponse } from "@/lib/constants/cache";
import { del } from "@vercel/blob";
import { migrateAllBlogImages } from "@/lib/utils/blobMigration";
import { requireAuth, isAuthError, successResponse, errorResponse } from "@/lib/api/apiHelpers";
import { validateAndPrepareBlogBody } from "@/lib/api/blogHelpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blog) {
      return errorResponse("Blog not found", 404);
    }

    return cachedJsonResponse({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return errorResponse("Failed to fetch blog", 500);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

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
      return errorResponse(`Unexpected fields: ${unexpectedKeys.join(", ")}`);
    }

    if (Object.keys(updateData).length === 0) {
      return errorResponse("No valid fields to update");
    }

    const validationError = validateAndPrepareBlogBody(updateData);
    if (validationError) return validationError;

    // Migrate blob images when slug changes
    const [existingBlog] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, id));

    if (!existingBlog) {
      return errorResponse("Blog not found", 404);
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
      return errorResponse("Blog not found", 404);
    }
    return successResponse(blog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return errorResponse("Failed to update blog", 500);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { id } = await params;

    // Fetch blog first to get image URLs for cleanup
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blog) {
      return errorResponse("Blog not found", 404);
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

    return successResponse({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return errorResponse("Failed to delete blog", 500);
  }
}

