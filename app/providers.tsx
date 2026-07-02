"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { SiteToaster } from "@/components/shared/feedback/SiteToaster";
import dynamic from "next/dynamic";

const SmoothScroll = dynamic(
  () =>
    import("@/components/shared/scroll/SmoothScroll").then((m) => ({
      default: m.SmoothScroll,
    })),
  { ssr: false },
);

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
      <SmoothScroll>{children}</SmoothScroll>
      <SiteToaster />
    </ThemeProvider>
  );
}
