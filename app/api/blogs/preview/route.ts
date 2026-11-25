import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";
import { getPreviewExclusiveBlobUrls } from "@/lib/api/blogHelpers";
import { isPreviewSlug, toPreviewSlug } from "@/lib/db/blogPreview";
import { createUrlSlug } from "@/lib/utils/urlHelpers";

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    if (!body.title) {
      return errorResponse("Title is required for preview");
    }

    const baseSlug = body.slug || createUrlSlug(body.title);
    const previewSlug = toPreviewSlug(baseSlug);

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

export async function DELETE(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const { slug } = await request.json();

    if (!slug || !isPreviewSlug(slug)) {
      return errorResponse("Invalid preview slug");
    }

    const [preview] = await db.select().from(blogs).where(eq(blogs.slug, slug));

    if (!preview) {
      return successResponse({ message: "No preview to delete" });
    }

    const imagesToDelete = await getPreviewExclusiveBlobUrls(
      preview.imageUrl,
      preview.blogPost,
      slug,
    );

    await db.delete(blogs).where(eq(blogs.id, preview.id));

    if (imagesToDelete.length > 0) {
      del(imagesToDelete).catch((err) =>
        console.error("Failed to delete preview blobs:", err),
      );
    }

    return successResponse({ message: "Preview deleted" });
  } catch (error) {
    console.error("Error deleting preview:", error);
    return errorResponse("Failed to delete preview", 500);
  }
}
