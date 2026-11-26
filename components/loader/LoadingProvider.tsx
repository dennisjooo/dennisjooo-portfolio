"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { dismissSSRCover } from "./dismissSSRCover";
import { isScrollAnimationsReady } from "@/lib/utils/scrollHelpers";

const FIRST_VISIT_KEY = "portfolio-has-visited";
const INITIAL_MIN_MS = 1200;
const ANIMATIONS_WAIT_MS = 4000;

function getHasVisited() {
  try {
    return sessionStorage.getItem(FIRST_VISIT_KEY) === "true";
  } catch {
    return false;
  }
}

function markScrollReady() {
  document.documentElement.setAttribute("data-scroll-ready", "true");
}

type LoadingProviderProps = {
  children: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
  const pathname = usePathname();
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const didRevealRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revealContent = useCallback(() => {
    setShowInitialLoader(false);
    try {
      sessionStorage.setItem(FIRST_VISIT_KEY, "true");
    } catch {
      /* ignore */
    }

    if (didRevealRef.current) return;
    didRevealRef.current = true;

    setContentReady(true);
    markScrollReady();
    dismissSSRCover();
    window.dispatchEvent(new Event("portfolio:content-revealed"));
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isHome = pathname === "/";

    if (reduceMotion || !isHome) {
      revealContent();
      return;
    }

    let minElapsed = getHasVisited();
    let animationsReady = isScrollAnimationsReady();

    const tryReveal = () => {
      if (minElapsed && animationsReady) revealContent();
    };

    const onAnimationsReady = () => {
      animationsReady = true;
      tryReveal();
    };

    if (!animationsReady) {
      window.addEventListener(
        "portfolio:scroll-animations-ready",
        onAnimationsReady,
        { once: true },
      );
    }

    if (!minElapsed) {
      timerRef.current = setTimeout(() => {
        minElapsed = true;
        tryReveal();
      }, INITIAL_MIN_MS);
    } else {
      tryReveal();
    }

    const fallback = setTimeout(() => {
      minElapsed = true;
      animationsReady = true;
      revealContent();
    }, ANIMATIONS_WAIT_MS);

    return () => {
      window.removeEventListener(
        "portfolio:scroll-animations-ready",
        onAnimationsReady,
      );
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(fallback);
    };
  }, [pathname, revealContent]);

  useEffect(() => {
    if (!showInitialLoader) return;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const originalHtmlOverflow = htmlEl.style.overflow;
    const originalBodyOverflow = bodyEl.style.overflow;

    htmlEl.style.overflow = "hidden";
    bodyEl.style.overflow = "hidden";

    if (window.portfolioLenis) {
      window.portfolioLenis.stop();
    }

    const handleLenisReady = () => {
      if (window.portfolioLenis) {
        window.portfolioLenis.stop();
      }
    };

    window.addEventListener("portfolio:lenis-ready", handleLenisReady);

    return () => {
      htmlEl.style.overflow = originalHtmlOverflow;
      bodyEl.style.overflow = originalBodyOverflow;
      window.removeEventListener("portfolio:lenis-ready", handleLenisReady);
      if (window.portfolioLenis) {
        window.portfolioLenis.start();
      }
    };
  }, [showInitialLoader]);

  return (
    <div data-content-ready={contentReady ? "true" : "false"}>{children}</div>
  );
}
