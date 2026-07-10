"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : null)}
    >
      <DialogContent className="glass-panel max-w-md gap-0 rounded-2xl border-border/50 p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-caslon text-2xl italic tracking-tight text-foreground">
            Leave without saving?
          </DialogTitle>
          <DialogDescription className="max-w-[95%] text-base leading-relaxed text-muted-foreground/80">
            You have unsaved changes. If you leave now, your updates will be
            lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-3 pt-6">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
