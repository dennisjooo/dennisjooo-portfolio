"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formStyles } from "./formStyles";

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
    <Dialog open={open} onOpenChange={(nextOpen) => (!nextOpen ? onCancel() : null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Leave without saving?</DialogTitle>
          <DialogDescription>
            You have unsaved changes. If you leave now, your updates will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <button type="button" onClick={onCancel} className={formStyles.cancelButton}>
            Stay
          </button>
          <button type="button" onClick={onConfirm} className={formStyles.submitButton}>
            Leave
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
