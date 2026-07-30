"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  footer: ReactNode;
}

export function AdminDialogShell({
  open,
  onOpenChange,
  title,
  description,
  footer,
}: AdminDialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-md gap-0 rounded-2xl border-border/50 p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="font-caslon text-2xl italic tracking-tight text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="max-w-[95%] text-base leading-relaxed text-muted-foreground/80">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-3 pt-6">
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
