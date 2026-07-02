"use client";

import { useParallax } from "@/lib/hooks/scroll/useParallax";
import { PublicShell } from "@/components/layout/PublicShell";
import { NotFoundBackground } from "./NotFoundBackground";
import { NotFoundContent } from "./NotFoundContent";
import { NotFoundDiagnostics } from "./NotFoundDiagnostics";

export function NotFoundPage() {
  const { mounted, foreground, background } = useParallax();

  if (!mounted) return null;

  return (
    <PublicShell>
      <main className="bg-noise relative h-screen w-full overflow-hidden bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <NotFoundBackground x={background.x} y={background.y} />
        <NotFoundContent x={foreground.x} y={foreground.y} />
        <NotFoundDiagnostics />

        <div className="absolute bottom-0 right-12 hidden h-32 w-px bg-gradient-to-t from-foreground/20 to-transparent md:block" />
        <div className="absolute left-12 top-0 hidden h-32 w-px bg-gradient-to-b from-foreground/20 to-transparent md:block" />
      </main>
    </PublicShell>
  );
}
