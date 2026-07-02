"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { MotionProvider } from "@/components/motion";
import Navbar from "@/components/layout/navbar/Navbar";
import { SSRCoverDismiss } from "@/components/loader/SSRCoverDismiss";
import type { ContactLinkData } from "@/lib/types/contacts";

const CommandPalette = dynamic(() =>
  import("@/components/command-palette/CommandPalette").then((m) => ({
    default: m.CommandPalette,
  })),
);

interface PublicShellProps {
  children: ReactNode;
  contacts?: ContactLinkData[];
}

export function PublicShell({ children, contacts }: PublicShellProps) {
  return (
    <MotionProvider>
      <SSRCoverDismiss />
      <Navbar />
      <CommandPalette contacts={contacts} />
      {children}
    </MotionProvider>
  );
}
