"use client";

import Link from "next/link";
import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { m } from "@/components/motion";
import type { MotionValue } from "framer-motion";

const actionClasses =
  "group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground";

interface NotFoundContentProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onRetry?: () => void;
}

export function NotFoundContent({ x, y, onRetry }: NotFoundContentProps) {
  return (
    <m.div
      className="absolute bottom-12 left-6 z-10 max-w-xl md:bottom-24 md:left-24"
      style={{ x, y }}
    >
      <div className="flex flex-col gap-8">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-display font-caslon text-6xl italic leading-[0.85] tracking-tight md:text-7xl lg:text-8xl">
            {onRetry ? "That" : "Nothing"}
            <br />
            <span className="text-accent">{onRetry ? "broke." : "here."}</span>
          </h2>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="max-w-sm font-sans text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            {onRetry
              ? "Something failed on our side. Try again, or head back if it keeps happening."
              : "This URL doesn't lead anywhere. It may have moved, or never existed."}
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {onRetry && (
              <button type="button" onClick={onRetry} className={actionClasses}>
                Try again
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            )}
            <Link href="/" className={actionClasses}>
              Return to Base
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </m.div>
      </div>
    </m.div>
  );
}
