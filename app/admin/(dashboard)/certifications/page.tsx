"use client";

import { createAdminListPage } from "@/components/admin/factories/createAdminListPage";
import { createCertificationColumns } from "@/components/admin/columns";

export default createAdminListPage({
  endpoint: "/api/certifications",
  pageSize: 10,
  itemName: "certification",
  deleteSuccessMessage: "Certification deleted successfully",
  header: {
    title: "Certifications",
    titleAccent: "& Licenses",
    subtitle: "Academic and professional milestones",
    actionHref: "/admin/certifications/new",
    actionLabel: "Add New",
  },
  deleteDialog: {
    title: "Delete Certification",
    description:
      "Are you sure you want to delete this certification? This action cannot be undone.",
  },
  createColumns: createCertificationColumns,
});
