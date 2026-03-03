import { createCrudHandlers } from "@/lib/api/crudRouteFactory";
import { db, workExperiences } from "@/lib/db";
import { eq, and, ne } from "drizzle-orm";
import { del } from "@vercel/blob";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";

const crud = createCrudHandlers(workExperiences, "work experience");

export const GET = crud.GET;
export const PUT = crud.PUT;

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  const { id } = await params;

  try {
    const [experience] = await db
      .select()
      .from(workExperiences)
      .where(eq(workExperiences.id, id));

    if (!experience) {
      return errorResponse("Work experience not found", 404);
    }

    const imageUrl = experience.imageSrc;
    let shouldDeleteBlob = false;

    if (imageUrl?.includes("vercel-storage.com")) {
      const [otherUsage] = await db
        .select({ id: workExperiences.id })
        .from(workExperiences)
        .where(
          and(eq(workExperiences.imageSrc, imageUrl), ne(workExperiences.id, id))
        )
        .limit(1);

      shouldDeleteBlob = !otherUsage;
    }

    await db.delete(workExperiences).where(eq(workExperiences.id, id));

    if (shouldDeleteBlob) {
      del([imageUrl]).catch((err) =>
        console.error("Failed to delete blob:", err)
      );
    }

    return successResponse({});
  } catch (error) {
    console.error("Failed to delete work experience:", error);
    return errorResponse("Failed to delete work experience");
  }
}
