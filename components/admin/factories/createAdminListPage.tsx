"use client";

import { AdminTable, Column } from "@/components/admin/layout/AdminTable";
import {
  AdminPageHeader,
  AdminReorderHint,
  ConfirmDialog,
} from "@/components/admin/shared";
import { useAdminList } from "@/components/admin/hooks";

interface ListPageHeaderConfig {
  title: string;
  titleAccent: string;
  subtitle: string;
  actionHref: string;
  actionLabel: string;
}

interface ListPageDeleteDialogConfig {
  title: string;
  description: string;
}

interface AdminListPageConfig<T extends { id: string; order?: number | null }> {
  endpoint: string;
  pageSize?: number;
  enableReorder?: boolean;
  reorderEndpoint?: string;
  itemName: string;
  deleteSuccessMessage: string;
  header: ListPageHeaderConfig;
  deleteDialog: ListPageDeleteDialogConfig;
  createColumns: (handleDelete: (id: string) => void) => Column<T>[];
  disablePagination?: boolean;
}

export function createAdminListPage<
  T extends { id: string; order?: number | null },
>(config: AdminListPageConfig<T>) {
  const {
    endpoint,
    pageSize,
    enableReorder = false,
    reorderEndpoint,
    itemName,
    deleteSuccessMessage,
    header,
    deleteDialog,
    createColumns,
    disablePagination = false,
  } = config;

  return function AdminListPage() {
    const {
      items,
      loading,
      currentPage,
      totalPages,
      handlePageChange,
      handleDelete,
      handleReorder,
      deleteDialog: dialogState,
      confirmDelete,
      cancelDelete,
    } = useAdminList<T>({
      endpoint,
      pageSize,
      enableReorder,
      reorderEndpoint,
      itemName,
      deleteSuccessMessage,
    });

    const columns = createColumns(handleDelete);

    return (
      <div className="space-y-8">
        <AdminPageHeader
          title={header.title}
          titleAccent={header.titleAccent}
          subtitle={header.subtitle}
          actionHref={header.actionHref}
          actionLabel={header.actionLabel}
        />

        <AdminTable
          columns={columns}
          data={items}
          isLoading={loading}
          currentPage={disablePagination ? 1 : currentPage}
          totalPages={disablePagination ? 1 : totalPages}
          onPageChange={disablePagination ? () => {} : handlePageChange}
          enableReorder={enableReorder}
          onReorder={enableReorder ? handleReorder : undefined}
        />

        {enableReorder && <AdminReorderHint />}

        <ConfirmDialog
          open={dialogState.open}
          title={deleteDialog.title}
          description={deleteDialog.description}
          confirmLabel="Delete"
          variant="danger"
          loading={dialogState.loading}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    );
  };
}
