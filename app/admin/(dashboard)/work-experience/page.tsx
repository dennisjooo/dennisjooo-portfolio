"use client";

import { createAdminListPage } from "@/components/admin/factories/createAdminListPage";
import { createWorkExperienceColumns } from "@/components/admin/columns";

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
    description:
      "Are you sure you want to delete this work experience? This action cannot be undone.",
  },
  createColumns: createWorkExperienceColumns,
});
