"use client";

import { m } from "@/components/motion";

interface NotFoundDiagnosticsProps {
  rows: [label: string, value: string][];
}

export function NotFoundDiagnostics({ rows }: NotFoundDiagnosticsProps) {
  return (
    <m.dl
      className="absolute left-6 right-6 top-28 z-10 font-mono text-[10px] uppercase tracking-widest md:left-auto md:right-12 md:top-32 md:w-80 md:text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between gap-6 border-t border-foreground/15 py-2"
        >
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="truncate text-foreground">{value}</dd>
        </div>
      ))}
    </m.dl>
  );
}
