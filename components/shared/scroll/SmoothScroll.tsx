"use client";

import { ReactNode, useEffect, useRef } from "react";
import { disableScrollRestoration } from "@/lib/utils/scrollHelpers";

interface SmoothScrollProps {
  children: ReactNode;
}

export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    disableScrollRestoration();

    isMounted.current = true;

    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isMobile || prefersReducedMotion) return;

    const initLenis = async () => {
      if (!isMounted.current) return () => {};

      const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("@/lib/motion/gsapBootstrap").then((m) =>
          m.loadGsapWithScrollTrigger(),
        ),
      ]);

      const lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      window.portfolioLenis = lenis;
      window.dispatchEvent(new Event("portfolio:lenis-ready"));

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.destroy();
        delete window.portfolioLenis;
        gsap.ticker.remove(lenis.raf);
      };
    };

    let cleanup: (() => void) | undefined;

    const startInit = () => {
      initLenis().then((cleanupFn) => {
        cleanup = cleanupFn;
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(startInit, { timeout: 3000 });
      return () => {
        window.cancelIdleCallback(idleId);
        isMounted.current = false;
        cleanup?.();
      };
    } else {
      const timeoutId = setTimeout(startInit, 1500);
      return () => {
        clearTimeout(timeoutId);
        isMounted.current = false;
        cleanup?.();
      };
    }
  }, []);

  return <>{children}</>;
};
