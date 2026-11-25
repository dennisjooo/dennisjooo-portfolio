"use client";

import CertificationForm from "@/components/admin/forms/CertificationForm";
import { createAdminEditPage } from "@/components/admin/factories";
import type { Certification } from "@/lib/db/schema";

export default createAdminEditPage<Certification>({
  endpoint: "/api/certifications",
  redirectTo: "/admin/certifications",
  itemName: "certification",
  FormComponent: CertificationForm,
  title: { accent: "Certification", subtitle: "Update credential details" },
});
