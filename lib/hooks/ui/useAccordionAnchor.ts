"use client";

import { useCallback, useEffect, useRef } from "react";

export const ACCORDION_DURATION_MS = 200;

function syncAnchor(element: HTMLElement, anchorTop: number) {
  const lenis = window.portfolioLenis;
  lenis?.resize();

  const delta = element.getBoundingClientRect().top - anchorTop;
  if (Math.abs(delta) < 0.5) return;

  if (lenis) {
    lenis.scrollTo(lenis.scroll + delta, { immediate: true });
    return;
  }

  window.scrollBy({ top: delta, left: 0, behavior: "instant" });
}

export function useAccordionAnchor(durationMs = ACCORDION_DURATION_MS) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return useCallback(
    (anchor: HTMLElement, update: () => void) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const anchorTop = anchor.getBoundingClientRect().top;
      update();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const duration = reduced ? 0 : durationMs;
      const start = performance.now();

      const tick = () => {
        syncAnchor(anchor, anchorTop);
        if (duration > 0 && performance.now() - start < duration) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        rafRef.current = null;
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [durationMs],
  );
}
