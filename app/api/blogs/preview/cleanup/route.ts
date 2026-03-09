import { db, blogs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import { requireAuth, isAuthError, successResponse, errorResponse } from "@/lib/api/apiHelpers";

/**
 * Cleanup endpoint for preview entries, designed to work with navigator.sendBeacon.
 * Accepts a POST with JSON body { slug: string }.
 */
export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const text = await request.text();
    const { slug } = JSON.parse(text);

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
    console.error("Error cleaning up preview:", error);
    return errorResponse("Failed to clean up preview", 500);
  }
}
