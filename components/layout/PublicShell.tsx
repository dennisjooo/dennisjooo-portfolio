"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollToTop } from "@/components/shared/scroll/ScrollToTop";
import { SmoothScroll } from "@/components/shared/scroll/SmoothScroll";
import NavbarClient from "@/components/layout/navbar/NavbarClient";
import type { ContactLinkData } from "@/lib/types/contacts";

const CommandPalette = dynamic(() =>
  import("@/components/command-palette/CommandPalette").then((m) => ({
    default: m.CommandPalette,
  })),
);
const Footer = dynamic(() => import("@/components/layout/Footer"));
const EasterEggs = dynamic(() =>
  import("@/components/fun/EasterEggs").then((m) => ({
    default: m.EasterEggs,
  })),
);
const RouteProgressBar = dynamic(() =>
  import("@/components/transitions/RouteProgressBar").then((m) => ({
    default: m.RouteProgressBar,
  })),
);

interface PublicShellProps {
  children: ReactNode;
  contacts?: ContactLinkData[];
}

export function PublicShell({ children, contacts }: PublicShellProps) {
  return (
    <MotionProvider>
      <SmoothScroll>
        <ScrollToTop />
        <NavbarClient />
        <CommandPalette contacts={contacts} />
        <EasterEggs />
        <main>{children}</main>
        <RouteProgressBar />
        <Footer />
      </SmoothScroll>
    </MotionProvider>
  );
}
