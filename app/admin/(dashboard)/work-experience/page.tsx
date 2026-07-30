"use client";

import { createAdminListPage } from "@/components/admin/factories";
import { createWorkExperienceColumns } from "@/components/admin/columns";
import { deleteDialogDescription } from "@/components/admin/shared/deleteDialogDescription";

export default createAdminListPage({
  endpoint: "/api/work-experience",
  enableReorder: true,
  reorderEndpoint: "/api/work-experience/reorder",
  itemName: "work experience",
  deleteSuccessMessage: "Item deleted successfully",
  disablePagination: true,
  header: {
    title: "Work",
    titleAccent: "Experience",
    subtitle: "Career timeline and education",
    actionHref: "/admin/work-experience/new",
    actionLabel: "Add New",
  },
  deleteDialog: {
    title: "Delete Work Experience",
    description: deleteDialogDescription("work experience"),
  },
  createColumns: createWorkExperienceColumns,
});
