"use client";

import { AdminDialogShell } from "./AdminDialogShell";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AdminDialogShell
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : null)}
      title={title}
      description={description}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-border px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              variant === "danger"
                ? "rounded-lg bg-destructive px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-destructive-foreground transition-all hover:bg-destructive/90 disabled:opacity-50"
                : "rounded-lg bg-primary px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            }
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </>
      }
    />
  );
}
