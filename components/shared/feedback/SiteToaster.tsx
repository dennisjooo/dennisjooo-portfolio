"use client";

import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const toastShell = cn(
  "site-toast group relative w-[min(90vw,380px)] overflow-hidden rounded-xl border border-border/80",
  "glass-panel bg-noise px-4 py-3 shadow-lg shadow-black/5 dark:shadow-black/20",
  "ring-1 ring-inset ring-black/5 dark:ring-white/10",
);

export function SiteToaster() {
  return (
    <Toaster
      theme="system"
      position="top-right"
      offset={{ top: 88, right: 24 }}
      mobileOffset={{ top: 80, right: 16 }}
      gap={10}
      duration={3000}
      icons={{
        success: null,
        error: null,
        info: null,
        warning: null,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: toastShell,
          content: "flex min-w-0 flex-col",
          title: "site-toast-title",
          description: "site-toast-description",
          icon: "hidden",
        },
      }}
    />
  );
}
