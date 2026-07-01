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
      <main className="relative h-screen w-full overflow-hidden bg-background text-foreground bg-noise selection:bg-accent selection:text-accent-foreground">
        <NotFoundBackground x={background.x} y={background.y} />
        <NotFoundContent x={foreground.x} y={foreground.y} />
        <NotFoundDiagnostics />

        <div className="absolute bottom-0 right-12 w-px h-32 bg-gradient-to-t from-foreground/20 to-transparent hidden md:block" />
        <div className="absolute top-0 left-12 w-px h-32 bg-gradient-to-b from-foreground/20 to-transparent hidden md:block" />
      </main>
    </PublicShell>
  );
}
