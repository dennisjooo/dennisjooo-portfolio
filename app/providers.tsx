"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SiteToaster } from "@/components/shared/feedback/SiteToaster";
import { LoadingProvider } from "@/components/loader/LoadingProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoadingProvider>{children}</LoadingProvider>
      <SiteToaster />
    </ThemeProvider>
  );
}
