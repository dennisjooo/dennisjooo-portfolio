import { createReorderHandler } from "@/lib/api/reorderRouteFactory";
import { contacts } from "@/lib/db";

export const { PUT } = createReorderHandler(contacts, "contacts");
