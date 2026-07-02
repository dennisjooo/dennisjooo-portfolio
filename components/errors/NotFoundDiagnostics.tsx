"use client";

import { m } from "@/components/motion";

export function NotFoundDiagnostics() {
  return (
    <m.div
      className="absolute right-6 top-28 z-10 hidden text-right md:right-12 md:top-32 md:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80 md:text-xs">
        <div className="flex items-center justify-end gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span>System Critical</span>
        </div>
        <span>ERR_CODE: 0x404</span>
        <span>LOC: UNKNOWN_SECTOR</span>
        <span>MEM: NULL_POINTER</span>
      </div>
    </m.div>
  );
}
