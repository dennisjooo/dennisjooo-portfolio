"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { MotionProvider } from "@/components/motion";
import NavbarClient from "@/components/layout/navbar/NavbarClient";
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
      <NavbarClient />
      <CommandPalette contacts={contacts} />
      {children}
    </MotionProvider>
  );
}
