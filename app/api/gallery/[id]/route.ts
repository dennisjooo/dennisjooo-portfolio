import { createCrudHandlers } from "@/lib/api/crudRouteFactory";
import { db, gallery } from "@/lib/db";
import { eq } from "drizzle-orm";
import { del } from "@vercel/blob";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";
import { getGalleryBlobUrls } from "@/lib/utils/galleryBlob";

const crud = createCrudHandlers(gallery, "gallery image");

export const GET = crud.GET;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  try {
    const body = await request.json();
    const [existing] = await db
      .select()
      .from(gallery)
      .where(eq(gallery.id, id));

    if (!existing) {
      return errorResponse("gallery image not found", 404);
    }

    const nextSlug = body.slug ?? existing.slug;
    const thumbUrl = body.thumbUrl ?? existing.thumbUrl;
    const fullUrl = body.fullUrl ?? existing.fullUrl;

    const [item] = await db
      .update(gallery)
      .set({
        ...body,
        slug: nextSlug,
        thumbUrl,
        fullUrl,
        updatedAt: new Date(),
      })
      .where(eq(gallery.id, id))
      .returning();

    if (!item) {
      return errorResponse("gallery image not found", 404);
    }

    return successResponse(item);
  } catch (error) {
    console.error("Failed to update gallery image:", error);
    return errorResponse("Failed to update gallery image");
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  try {
    const [item] = await db.select().from(gallery).where(eq(gallery.id, id));

    if (!item) {
      return errorResponse("gallery image not found", 404);
    }

    await db.delete(gallery).where(eq(gallery.id, id));

    const blobUrls = getGalleryBlobUrls(item.thumbUrl, item.fullUrl);
    if (blobUrls.length > 0) {
      del(blobUrls).catch((err) =>
        console.error("Failed to delete gallery blobs:", err),
      );
    }

    return successResponse({});
  } catch (error) {
    console.error("Failed to delete gallery image:", error);
    return errorResponse("Failed to delete gallery image");
  }
}
