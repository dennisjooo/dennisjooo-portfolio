"use client";

import { m, AnimatePresence } from "@/components/motion";
import { SITE_NAME } from "@/lib/constants/site";

type LoaderProps = {
  visible: boolean;
  progress: number;
};

export function Loader({ visible, progress }: LoaderProps) {
  const nameParts = SITE_NAME.split(" ");

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <m.div
          key="loader"
          className="loader-overlay fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-10 px-6">
            <div className="flex flex-col items-center gap-2" aria-hidden>
              {nameParts.map((part, lineIndex) => (
                <m.p
                  key={part}
                  className="font-caslon italic text-3xl md:text-5xl tracking-tight text-foreground leading-[1.15] py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: lineIndex * 0.12,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {part}
                </m.p>
              ))}
            </div>

            <div className="w-48 md:w-64 h-px bg-border overflow-hidden rounded-full">
              <m.div
                className="h-full bg-gradient-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.05 }}
              />
            </div>

            <m.span
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground tabular-nums"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(progress)}%
            </m.span>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
