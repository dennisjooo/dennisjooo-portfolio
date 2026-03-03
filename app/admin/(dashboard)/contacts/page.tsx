"use client";

import { AdminTable, Column } from "@/components/admin/AdminTable";
import { AdminPageHeader, AdminActionCell, AdminReorderHint } from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";
import type { Contact } from "@/lib/db";
import { CONTACT_ICON_MAP } from "@/lib/constants/contactIcons";
import { Globe } from "lucide-react";

export default function AdminContactsList() {
  const {
    items: contacts,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    handleDelete,
    handleReorder,
  } = useAdminList<Contact>({
    endpoint: "/api/contacts",
    pageSize: 10,
    enableReorder: true,
    reorderEndpoint: "/api/contacts/reorder",
    itemName: "contact",
    deleteConfirmMessage: "Are you sure you want to delete this contact?",
    deleteSuccessMessage: "Contact deleted successfully",
  });

  const columns: Column<Contact>[] = [
    {
      header: "Icon",
      cell: (row: Contact) => {
        const IconComponent = CONTACT_ICON_MAP[row.icon] || Globe;
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/50">
            <IconComponent className="w-4 h-4" />
          </div>
        );
      },
    },
    {
      header: "Label",
      primary: true,
      cell: (row: Contact) => (
        <span className="font-semibold text-foreground">{row.label}</span>
      ),
    },
    {
      header: "Link",
      cell: (row: Contact) => (
        <a
          href={row.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent truncate max-w-[200px] block"
        >
          {row.href}
        </a>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row: Contact) => (
        <AdminActionCell
          editHref={`/admin/contacts/${row.id}`}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

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
    </div>
  );
}
