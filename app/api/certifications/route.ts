import { certifications } from "@/lib/db";
import { desc } from "drizzle-orm";
import { createListRouteHandler } from "@/lib/api/listRouteFactory";

export const { GET, POST } = createListRouteHandler({
  table: certifications,
  entityName: "certification",
  orderBy: desc(certifications.date),
  sortableColumns: ["title", "issuer", "date"],
  cache: true,
});
