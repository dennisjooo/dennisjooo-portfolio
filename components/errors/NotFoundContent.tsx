"use client";

import Link from "next/link";
import { m } from "@/components/motion";
import type { MotionValue } from "framer-motion";

interface NotFoundContentProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function NotFoundContent({ x, y }: NotFoundContentProps) {
  return (
    <m.div
      className="absolute bottom-12 left-6 md:bottom-24 md:left-24 z-10 max-w-xl"
      style={{ x, y }}
    >
      <div className="flex flex-col gap-6">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:text-xs">
            Page Not Found
          </span>
          <h2 className="mb-4 font-caslon italic text-6xl leading-[0.85] tracking-tight text-display md:text-7xl lg:text-8xl">
            Lost
            <br />
            <span className="text-accent">Void</span>
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="pl-2 border-l-2 border-accent/30"
        >
          <p className="max-w-sm font-sans text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            The page you are looking for has been moved, deleted, or consumed by
            the void.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/85 px-10 py-4 font-sans text-sm font-medium text-muted-foreground backdrop-blur-md transition-[border-color,color,background-color] duration-200 ease-out hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:text-base"
          >
            Return to Base
          </Link>
        </m.div>
      </div>
    </m.div>
  );
}
