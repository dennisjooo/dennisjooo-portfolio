import { createCrudHandlers } from "@/lib/api/crudRouteFactory";
import { certifications } from "@/lib/db";

export const { GET, PUT, DELETE } = createCrudHandlers(
  certifications,
  "certification"
);
