import { db, workExperiences } from "@/lib/db";
import { asc, desc } from "drizzle-orm";
import { createListRouteHandler } from "@/lib/api/listRouteFactory";

async function assignWorkExperienceOrder(body: Record<string, unknown>) {
  if (body.order !== undefined) {
    return body;
  }

  const lastItems = await db
    .select({ order: workExperiences.order })
    .from(workExperiences)
    .orderBy(desc(workExperiences.order))
    .limit(1);

  return {
    ...body,
    order: lastItems.length > 0 ? (lastItems[0].order ?? 0) + 1 : 0,
  };
}

export const { GET, POST } = createListRouteHandler({
  table: workExperiences,
  entityName: "work experience",
  orderBy: asc(workExperiences.order),
  defaultOrderBy: [asc(workExperiences.order), desc(workExperiences.createdAt)],
  paginate: false,
  onBeforeInsert: assignWorkExperienceOrder,
});
