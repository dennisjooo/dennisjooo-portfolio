import { createReorderHandler } from "@/lib/api/reorderRouteFactory";
import { workExperiences } from "@/lib/db";

export const { PUT } = createReorderHandler(workExperiences, "work experiences");
