"use client";

import { m } from "@/components/motion";
import type { MotionValue } from "framer-motion";

interface NotFoundBackgroundProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function NotFoundBackground({ x, y }: NotFoundBackgroundProps) {
  return (
    <>
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      <m.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
        style={{ x, y }}
      >
        <div className="relative whitespace-nowrap">
          <h1 className="font-caslon italic text-[45vw] leading-none text-foreground/5 dark:text-foreground/10 select-none mix-blend-overlay">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full border-[1px] border-foreground/5" />
        </div>
      </m.div>
    </>
  );
}
