import { contacts } from "@/lib/db";
import { asc, desc } from "drizzle-orm";
import { createListRouteHandler } from "@/lib/api/listRouteFactory";

export const { GET, POST } = createListRouteHandler({
  table: contacts,
  entityName: "contact",
  orderBy: [asc(contacts.order), desc(contacts.createdAt)],
});
