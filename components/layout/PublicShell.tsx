"use client";

import { ReactNode } from "react";
import { MotionProvider } from "@/components/motion";
import Navbar from "@/components/layout/navbar/Navbar";
import { SSRCoverDismiss } from "@/components/loader/SSRCoverDismiss";

interface PublicShellProps {
  children: ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <MotionProvider>
      <SSRCoverDismiss />
      <Navbar />
      {children}
    </MotionProvider>
  );
}
