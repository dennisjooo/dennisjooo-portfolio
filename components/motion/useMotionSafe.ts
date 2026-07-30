"use client";

import { useReducedMotion } from "framer-motion";

export function useMotionSafe<T>(value: T): T | undefined {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? undefined : value;
}

export function useMotionSafeProps<T extends Record<string, unknown>>(
  props: T,
): Partial<T> {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? {} : props;
}

export function useInViewReveal<T>(variants: T) {
  const safeVariants = useMotionSafe(variants);

  return {
    variants: safeVariants,
    initial: safeVariants ? ("hidden" as const) : undefined,
    whileInView: safeVariants ? ("visible" as const) : undefined,
  };
}
