"use client";

import { createAdminListPage } from "@/components/admin/factories";
import { createBlogColumns } from "@/components/admin/columns";
import { BlogBulkActions } from "@/components/admin/BlogBulkActions";
import { BlogListToolbar } from "@/components/admin/BlogListToolbar";
import type { Blog } from "@/lib/db";
import {
  bulkDeleteDialogDescription,
  deleteDialogDescription,
} from "@/components/admin/shared/deleteDialogDescription";

export default createAdminListPage<Blog>({
  endpoint: "/api/blogs",
  pageSize: 10,
  itemName: "blog",
  deleteSuccessMessage: "Blog deleted successfully",
  spacing: "compact",
  enableSelect: true,
  header: {
    title: "Editorial",
    titleAccent: "Content",
    subtitle: "Manage your digital garden",
    actionHref: "/admin/blogs/new",
    actionLabel: "Create New",
  },
  deleteDialog: {
    title: "Delete Blog",
    description: deleteDialogDescription("blog"),
  },
  getSubtitle: ({ totalItems }) =>
    `Manage your digital garden${totalItems ? ` · ${totalItems} items` : ""}`,
  getDeleteDialog: ({ deleteDialog, selectedIds }) => ({
    title: deleteDialog.id
      ? "Delete Blog"
      : `Delete ${selectedIds.size} Blog${selectedIds.size > 1 ? "s" : ""}`,
    description: deleteDialog.id
      ? deleteDialogDescription("blog")
      : bulkDeleteDialogDescription(selectedIds.size, "blog"),
  }),
  toolbar: ({ searchQuery, filters, handleSearch, handleFilter }) => (
    <BlogListToolbar
      searchQuery={searchQuery}
      filters={filters}
      onSearch={handleSearch}
      onFilter={handleFilter}
    />
  ),
  bulkActions: ({ selectedIds, handleBulkDelete, refresh, clearSelection }) => (
    <BlogBulkActions
      selectedIds={selectedIds}
      onBulkDelete={handleBulkDelete}
      onComplete={() => refresh(false)}
      onClearSelection={clearSelection}
    />
  ),
  createColumns: createBlogColumns,
});
