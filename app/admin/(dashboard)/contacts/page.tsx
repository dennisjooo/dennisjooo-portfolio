"use client";

import { createAdminListPage } from "@/components/admin/factories/createAdminListPage";
import { createContactColumns } from "@/components/admin/columns";

export default createAdminListPage({
  endpoint: "/api/contacts",
  pageSize: 10,
  enableReorder: true,
  reorderEndpoint: "/api/contacts/reorder",
  itemName: "contact",
  deleteSuccessMessage: "Contact deleted successfully",
  header: {
    title: "Contacts",
    titleAccent: "& Socials",
    subtitle: "Manage your contact links and social profiles",
    actionHref: "/admin/contacts/new",
    actionLabel: "Add New",
  },
  deleteDialog: {
    title: "Delete Contact",
    description:
      "Are you sure you want to delete this contact? This action cannot be undone.",
  },
  createColumns: createContactColumns,
});
