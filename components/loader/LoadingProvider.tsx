"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { dismissSSRCover } from "./dismissSSRCover";

const FIRST_VISIT_KEY = "portfolio-has-visited";
const INITIAL_MIN_MS = 1200;

function getHasVisited() {
  try {
    return sessionStorage.getItem(FIRST_VISIT_KEY) === "true";
  } catch {
    return false;
  }
}

type LoadingProviderProps = {
  children: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
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
    dismissSSRCover();
    window.dispatchEvent(new Event("portfolio:content-revealed"));
  }, []);

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || getHasVisited()) {
      revealContent();
      return;
    }

    timerRef.current = setTimeout(revealContent, INITIAL_MIN_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [revealContent]);

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
