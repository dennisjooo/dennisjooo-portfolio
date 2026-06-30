"use client";

import { m } from "@/components/motion";

export function NotFoundDiagnostics() {
  return (
    <m.div
      className="absolute top-28 right-6 md:top-32 md:right-12 z-10 text-right hidden md:block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex flex-col gap-2 font-mono text-[10px] md:text-xs text-muted-foreground/80 uppercase tracking-[0.2em]">
        <div className="flex items-center justify-end gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>System Critical</span>
        </div>
        <span>ERR_CODE: 0x404</span>
        <span>LOC: UNKNOWN_SECTOR</span>
        <span>MEM: NULL_POINTER</span>
      </div>
    </m.div>
  );
}
