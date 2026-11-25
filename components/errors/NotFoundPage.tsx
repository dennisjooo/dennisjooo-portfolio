"use client";

import { usePathname } from "next/navigation";
import { useParallax } from "@/lib/hooks/scroll/useParallax";
import { NotFoundBackground } from "./NotFoundBackground";
import { NotFoundContent } from "./NotFoundContent";
import { NotFoundDiagnostics } from "./NotFoundDiagnostics";
import type { ContactLinkData } from "@/lib/types/contacts";

interface NotFoundPageProps {
  contacts?: ContactLinkData[];
  embedded?: boolean;
  error?: { digest?: string; reset: () => void };
}

export function NotFoundPage({ error }: NotFoundPageProps) {
  const pathname = usePathname();
  const { mounted, foreground, background } = useParallax();

  if (!mounted) return null;

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-background text-foreground">
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
    </div>
  );
}
