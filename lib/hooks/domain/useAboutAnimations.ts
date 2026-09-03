"use client";

import { RefObject, useEffect } from "react";
import { ContentSection } from "@/lib/content/aboutContent";
import {
  resolveSectionScrollTarget,
  setScrollAnimationsReady,
} from "@/lib/utils/scrollHelpers";
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
  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return;

    let cleanup: (() => void) | undefined;
    let gsapLoaded = false;

    const initAnimations = async () => {
      if (gsapLoaded) return;
      gsapLoaded = true;

      const gsapCleanup = await initAboutGsapAnimations(
        sectionRef,
        contentSections,
      );

      cleanup = () => {
        gsapCleanup();
        setScrollAnimationsReady(false);
      };

      requestAnimationFrame(() => {
        void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
          setScrollAnimationsReady(true);
          window.dispatchEvent(new Event("portfolio:scroll-animations-ready"));
        });
      });
    };

    const startObserving = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            initAnimations();
            observer.disconnect();
          }
        },
        { rootMargin: "100px" },
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    };

    let disconnectObserver: (() => void) | undefined;

    const onContentRevealed = () => {
      disconnectObserver?.();
      disconnectObserver = startObserving();
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    const pendingSection = resolveSectionScrollTarget();
    const shouldEagerInit = pendingSection !== "" && pendingSection !== "home";

    if (shouldEagerInit) {
      void initAnimations();
    } else if (document.querySelector('[data-content-ready="true"]')) {
      disconnectObserver = startObserving();
    } else {
      window.addEventListener("portfolio:content-revealed", onContentRevealed, {
        once: true,
      });
    }

    return () => {
      disconnectObserver?.();
      window.removeEventListener(
        "portfolio:content-revealed",
        onContentRevealed,
      );
      cleanup?.();
    };
  }, [sectionRef, containerRef, contentSections]);
};
