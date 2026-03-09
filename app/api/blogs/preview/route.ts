import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import { requireAuth, isAuthError, successResponse, errorResponse } from "@/lib/api/apiHelpers";

/**
 * Creates or updates a temporary preview entry with a `-preview` suffixed slug.
 * Returns the preview slug so the client can open it in a new tab.
 */
export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    if (!body.title) {
      return errorResponse("Title is required for preview");
    }

    const baseSlug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const previewSlug = `${baseSlug}-preview`;

    // Check if a preview entry already exists for this slug
    const [existing] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, previewSlug));

    const previewData = {
      title: body.title,
      description: body.description || "",
      imageUrl: body.imageUrl || null,
      blogPost: body.blogPost || "",
      date: body.date || new Date().toISOString().split("T")[0],
      type: body.type || "blog",
      links: body.links || [],
      slug: previewSlug,
      status: "draft" as const,
      publishAt: null,
      updatedAt: new Date(),
    };

    if (existing) {
      await db.update(blogs).set(previewData).where(eq(blogs.id, existing.id));
    } else {
      await db.insert(blogs).values(previewData);
    }

    return successResponse({ slug: previewSlug });
  } catch (error) {
    console.error("Error creating preview:", error);
    return errorResponse("Failed to create preview", 500);
  }
}

/**
 * Deletes a preview entry by slug.
 * Accepts { slug: string } in the body.
 */
export async function DELETE(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { slug } = await request.json();

    if (!slug || !slug.endsWith("-preview")) {
      return errorResponse("Invalid preview slug");
    }

    const [preview] = await db
      .select()
      .from(blogs)
      .where(eq(blogs.slug, slug));

    if (!preview) {
      return successResponse({ message: "No preview to delete" });
    }

    // Collect blob images for cleanup
    const imagesToDelete: string[] = [];
    if (preview.imageUrl?.includes("vercel-storage.com")) {
      imagesToDelete.push(preview.imageUrl);
    }
    const imgRegex = /!\[.*?\]\((https:\/\/[^)]+vercel-storage\.com[^)]+)\)/g;
    let match;
    while ((match = imgRegex.exec(preview.blogPost || "")) !== null) {
      imagesToDelete.push(match[1]);
    }

    await db.delete(blogs).where(eq(blogs.id, preview.id));

    if (imagesToDelete.length > 0) {
      del(imagesToDelete).catch((err) =>
        console.error("Failed to delete preview blobs:", err)
      );
    }

    return successResponse({ message: "Preview deleted" });
  } catch (error) {
    console.error("Error deleting preview:", error);
    return errorResponse("Failed to delete preview", 500);
  }
}
