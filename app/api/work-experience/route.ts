import { db, workExperiences } from "@/lib/db";
import { asc, desc } from "drizzle-orm";
import {
  requireAuth,
  isAuthError,
  successResponse,
  errorResponse,
} from "@/lib/api/apiHelpers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortByParam = searchParams.get("sortBy");
    const sortOrderParam = searchParams.get("sortOrder") === "asc" ? asc : desc;

    let orderByClause;

    if (sortByParam) {
      if (sortByParam === "title")
        orderByClause = sortOrderParam(workExperiences.title);
      else if (sortByParam === "date")
        orderByClause = sortOrderParam(workExperiences.date);
      else if (sortByParam === "createdAt")
        orderByClause = sortOrderParam(workExperiences.createdAt);
      else if (sortByParam === "updatedAt")
        orderByClause = sortOrderParam(workExperiences.updatedAt);
    }

    const query = db.select().from(workExperiences);

    if (orderByClause) {
      query.orderBy(orderByClause);
    } else {
      query.orderBy(
        asc(workExperiences.order),
        desc(workExperiences.createdAt),
      );
    }

    const experiences = await query;
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
