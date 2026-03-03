import { db, workExperiences } from "@/lib/db";
import { asc, desc } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";

export async function GET() {
  try {
    const experiences = await db
      .select()
      .from(workExperiences)
      .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt));
    return successResponse(experiences);
  } catch (error) {
    console.error("Failed to fetch work experiences:", error);
    return errorResponse("Failed to fetch work experiences");
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuth();
  if (isAuthError(authResult)) return authResult;

  try {
    const body = await request.json();

    if (body.order === undefined) {
      const lastItems = await db
        .select({ order: workExperiences.order })
        .from(workExperiences)
        .orderBy(desc(workExperiences.order))
        .limit(1);
      body.order = lastItems.length > 0 ? (lastItems[0].order ?? 0) + 1 : 0;
    }

    const [experience] = await db
      .insert(workExperiences)
      .values(body)
      .returning();
    return successResponse(experience, 201);
  } catch (error) {
    console.error("Failed to create work experience:", error);
    return errorResponse("Failed to create work experience");
  }
}
