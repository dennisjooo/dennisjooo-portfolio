"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import {
  AdminPageHeader,
  AdminReorderHint,
  ConfirmDialog,
} from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";
import type { Contact } from "@/lib/db";
import { createContactColumns } from "./columns";

export default function AdminContactsList() {
  const {
    items: contacts,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
    handleReorder,
    deleteDialog,
    confirmDelete,
    cancelDelete,
  } = useAdminList<Contact>({
    endpoint: "/api/contacts",
    pageSize: 10,
    enableReorder: true,
    reorderEndpoint: "/api/contacts/reorder",
    itemName: "contact",
    deleteSuccessMessage: "Contact deleted successfully",
  });

  const columns = createContactColumns(handleDelete);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Contacts"
        titleAccent="& Socials"
        subtitle="Manage your contact links and social profiles"
        actionHref="/admin/contacts/new"
        actionLabel="Add New"
      />

      <AdminTable
        columns={columns}
        data={contacts}
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        enableReorder
        onReorder={handleReorder}
      />
      <AdminReorderHint />
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteDialog.loading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
