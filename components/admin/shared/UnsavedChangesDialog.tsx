"use client";

import { AdminDialogShell } from "./AdminDialogShell";

interface UnsavedChangesDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({
  open,
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <AdminDialogShell
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : null)}
      title="Leave without saving?"
      description="You have unsaved changes. If you leave now, your updates will be lost."
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Stay
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-primary px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
          >
            Leave
          </button>
        </>
      }
    />
  );
}
