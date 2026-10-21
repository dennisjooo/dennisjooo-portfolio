"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useParallax } from "@/lib/hooks/scroll/useParallax";
import { PublicShell } from "@/components/layout/PublicShell";
import { NotFoundBackground } from "./NotFoundBackground";
import { NotFoundContent } from "./NotFoundContent";
import { NotFoundDiagnostics } from "./NotFoundDiagnostics";
import type { ContactLinkData } from "@/lib/types/contacts";

const Footer = dynamic(() => import("@/components/layout/Footer"));

interface NotFoundPageProps {
  contacts?: ContactLinkData[];
  embedded?: boolean;
  error?: { digest?: string; reset: () => void };
}

export function NotFoundPage({
  contacts,
  embedded = false,
  error,
}: NotFoundPageProps) {
  const pathname = usePathname();
  const { mounted, foreground, background } = useParallax();

  if (!mounted) return null;

  const page = (
    <main className="bg-noise relative h-screen w-full overflow-hidden bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <NotFoundBackground
        x={background.x}
        y={background.y}
        code={error ? "500" : undefined}
      />
      <NotFoundContent
        x={foreground.x}
        y={foreground.y}
        onRetry={error?.reset}
      />
      <NotFoundDiagnostics
        rows={[
          ["Status", error ? "500" : "404"],
          ["Path", pathname],
          ...(error
            ? [["Ref", error.digest ?? "none"] as [string, string]]
            : []),
          ["Time", new Date().toISOString().slice(0, 19) + "Z"],
        ]}
      />

      <div className="absolute bottom-0 right-12 hidden h-32 w-px bg-gradient-to-t from-foreground/20 to-transparent md:block" />
      <div className="absolute left-12 top-0 hidden h-32 w-px bg-gradient-to-b from-foreground/20 to-transparent md:block" />
    </main>
  );

  if (embedded) return page;

  return (
    <PublicShell contacts={contacts}>
      {page}
      <Footer />
    </PublicShell>
  );
}
