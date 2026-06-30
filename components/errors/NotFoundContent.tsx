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
          <h2 className="font-sans font-black text-7xl md:text-9xl tracking-tighter leading-[0.85] mb-4">
            LOST
            <br />
            <span className="text-accent">VOID</span>
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="pl-2 border-l-2 border-accent/30"
        >
          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
            // ERROR_404: The requested trajectory has led to a null reference.
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background/85 px-10 py-4 text-base font-medium text-muted-foreground backdrop-blur-md transition-[border-color,color,background-color] duration-200 ease-out hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Return to Base
          </Link>
        </m.div>
      </div>
    </m.div>
  );
}
