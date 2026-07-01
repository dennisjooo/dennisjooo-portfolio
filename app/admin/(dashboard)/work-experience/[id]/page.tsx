"use client";

import WorkExperienceForm from "@/components/admin/forms/WorkExperienceForm";
import { createAdminEditPage } from "@/components/admin/factories";
import type { WorkExperience } from "@/lib/db";

export default createAdminEditPage<WorkExperience>({
  endpoint: "/api/work-experience",
  redirectTo: "/admin/work-experience",
  itemName: "work experience",
  FormComponent: WorkExperienceForm,
  title: { accent: "Experience", subtitle: "Update position details" },
});
