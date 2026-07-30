"use client";

import { createAdminListPage } from "@/components/admin/factories";
import { createCertificationColumns } from "@/components/admin/columns";
import { deleteDialogDescription } from "@/components/admin/shared/deleteDialogDescription";

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
    description: deleteDialogDescription("certification"),
  },
  createColumns: createCertificationColumns,
});
