import { contacts } from "@/lib/db";
import { createListRouteHandler } from "@/lib/api/listRouteFactory";
import { contactsOrderBy } from "@/lib/db/siteQueries";

export const { GET, POST } = createListRouteHandler({
  table: contacts,
  entityName: "contact",
  orderBy: [...contactsOrderBy()],
  paginate: false,
});
