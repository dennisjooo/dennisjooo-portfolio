"use client";

import { springConfigs, viewportSettings } from "./config";
import { createFadeUpItem } from "./variants";
import { useMotionSafe } from "./useMotionSafe";

interface UseFadeUpInViewOptions {
  index?: number;
  y?: number;
  hoverY?: number;
  maxDelay?: number;
  delayMultiplier?: number;
  scale?: number;
}

export function useFadeUpInView({
  index = 0,
  y = 30,
  hoverY = -6,
  maxDelay = 0.24,
  delayMultiplier = 0.08,
  scale,
}: UseFadeUpInViewOptions = {}) {
  const delay = Math.min(index * delayMultiplier, maxDelay);
  const variants = createFadeUpItem(y, {
    scale,
    delay: delay > 0 ? delay : undefined,
  });
  const safeVariants = useMotionSafe(variants);
  const whileHover = useMotionSafe({
    y: hoverY,
    transition: springConfigs.snappy,
  });

  return {
    motionProps: {
      variants: safeVariants,
      initial: safeVariants ? ("hidden" as const) : undefined,
      whileInView: safeVariants ? ("visible" as const) : undefined,
      viewport: viewportSettings.once,
      whileHover,
    },
  };
}
