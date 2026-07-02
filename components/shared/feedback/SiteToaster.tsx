"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const toastShell = cn(
  "site-toast group relative w-[min(90vw,380px)] overflow-hidden rounded-xl border border-border/80",
  "glass-panel bg-noise px-4 py-3",
  "text-foreground ring-1 ring-inset ring-black/5 dark:ring-white/10",
);

export function SiteToaster() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Toaster
      theme={theme}
      position="top-right"
      offset={{ top: 88, right: 24 }}
      mobileOffset={{ top: 80, right: 16 }}
      gap={10}
      expand={false}
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
