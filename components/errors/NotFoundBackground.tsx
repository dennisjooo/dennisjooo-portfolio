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
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      />

      <m.div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        style={{ x, y }}
      >
        <div className="relative whitespace-nowrap">
          <h1 className="select-none font-caslon text-[45vw] font-normal italic leading-none tracking-tight text-foreground/5 mix-blend-overlay dark:text-foreground/10 dark:mix-blend-screen">
            404
          </h1>
          <div className="absolute left-1/2 top-1/2 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1px] border-foreground/5" />
        </div>
      </m.div>
    </>
  );
}
