"use client";

import { m } from "@/components/motion";
import type { MotionValue } from "framer-motion";

interface NotFoundBackgroundProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  code?: string;
}

export function NotFoundBackground({
  x,
  y,
  code = "404",
}: NotFoundBackgroundProps) {
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
          <h1 className="select-none font-serif text-[10rem] font-normal leading-none tracking-tight text-foreground/10 md:text-[14rem]">
            {code}
          </h1>
        </div>
      </m.div>
    </>
  );
}
