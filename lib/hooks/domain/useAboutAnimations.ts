"use client";

import { RefObject, useLayoutEffect } from "react";
import { ContentSection } from "@/lib/content/aboutContent";
import { setScrollAnimationsReady } from "@/lib/utils/scrollHelpers";
import { initAboutGsapAnimations } from "./aboutAnimationSetup";

interface UseAboutAnimationsProps {
  sectionRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  contentSections: ContentSection[];
}

export const useAboutAnimations = ({
  sectionRef,
  containerRef,
  contentSections,
}: UseAboutAnimationsProps) => {
  const sectionsKey = contentSections.map((section) => section.id).join();

  useLayoutEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const refreshTriggers = (markReady = false) => {
      void import("@/lib/motion/gsapBootstrap")
        .then((m) => m.loadGsapWithScrollTrigger())
        .then(({ ScrollTrigger }) => {
          if (cancelled) return;
          ScrollTrigger.refresh();
          if (!markReady) return;
          setScrollAnimationsReady(true);
          window.dispatchEvent(new Event("portfolio:scroll-animations-ready"));
        });
    };

    const initAnimations = async () => {
      const gsapCleanup = await initAboutGsapAnimations(
        sectionRef,
        containerRef,
        contentSections,
      );

      if (cancelled) {
        gsapCleanup();
        return;
      }

      cleanup = () => {
        gsapCleanup();
        setScrollAnimationsReady(false);
      };

      requestAnimationFrame(() => refreshTriggers(true));
    };

    const onRefresh = () => refreshTriggers();

    void initAnimations();

    window.addEventListener("portfolio:content-revealed", onRefresh);
    window.addEventListener("portfolio:lenis-ready", onRefresh);

    return () => {
      cancelled = true;
      window.removeEventListener("portfolio:content-revealed", onRefresh);
      window.removeEventListener("portfolio:lenis-ready", onRefresh);
      cleanup?.();
    };
  }, [sectionRef, containerRef, contentSections, sectionsKey]);
};
