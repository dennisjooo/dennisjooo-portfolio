import { createCrudHandlers } from "@/lib/api/crudRouteFactory";
import { contacts } from "@/lib/db";

export const { GET, PUT, DELETE } = createCrudHandlers(contacts, "contact");
