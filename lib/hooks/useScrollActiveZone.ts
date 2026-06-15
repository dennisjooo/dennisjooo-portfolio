"use client";

import { RefObject, useEffect, useState } from "react";

interface UseScrollActiveZoneOptions {
  /** Distance from top of viewport where activation occurs (px). Default 128 (top-32). */
  offset?: number;
}

export function useScrollActiveZone(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollActiveZoneOptions = {},
): boolean {
  const { offset = 128 } = options;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const check = () => {
      const rect = element.getBoundingClientRect();
      setIsActive(rect.top <= offset && rect.bottom > offset);
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [offset, ref]);

  return isActive;
}
