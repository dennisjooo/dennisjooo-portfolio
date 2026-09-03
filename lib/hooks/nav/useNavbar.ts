"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  scrollToTop,
  scrollToSection,
  setPendingSectionScroll,
} from "@/lib/utils/scrollHelpers";

// Constants
const SCROLL_THRESHOLD = 20;
const SCROLL_DIRECTION_THRESHOLD = 10;

interface HeroSectionState {
  isHeroSection: boolean;
  scrolled: boolean;
  isNavbarVisible: boolean;
}

interface UseHeroSectionStateOptions {
  isMenuOpen?: boolean;
  prefersReducedMotion?: boolean;
}

const supportsNavbarAutoHide = (pathname: string): boolean =>
  pathname === "/" || pathname === "/blogs" || pathname.startsWith("/blogs/");

export const useHeroSectionState = (
  isClientReady: boolean,
  pathname: string,
  options: UseHeroSectionStateOptions = {},
): HeroSectionState => {
  const isMenuOpen = options.isMenuOpen ?? false;
  const prefersReducedMotion = options.prefersReducedMotion ?? false;

  const [state, setState] = useState<HeroSectionState>({
    isHeroSection: true,
    scrolled: false,
    isNavbarVisible: true,
  });

  useEffect(() => {
    if (!isClientReady) return;

    let rafId: number | null = null;
    let scrollY = 0;
    let prevScrollY = 0;
    let isNavbarVisible = true;

    const updateState = () => {
      const heroSection = document.getElementById("home");
      const isHeroSection = heroSection
        ? scrollY < heroSection.offsetTop + heroSection.offsetHeight
        : false;

      const canAutoHide =
        supportsNavbarAutoHide(pathname) &&
        !isHeroSection &&
        !isMenuOpen &&
        !prefersReducedMotion;

      if (!canAutoHide) {
        isNavbarVisible = true;
      } else {
        const delta = scrollY - prevScrollY;
        if (delta > SCROLL_DIRECTION_THRESHOLD) {
          isNavbarVisible = false;
        } else if (delta < -SCROLL_DIRECTION_THRESHOLD) {
          isNavbarVisible = true;
        }
      }

      prevScrollY = scrollY;

      setState({
        isHeroSection,
        scrolled: scrollY > SCROLL_THRESHOLD,
        isNavbarVisible,
      });
      rafId = null;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (rafId === null) {
        rafId = requestAnimationFrame(updateState);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isClientReady, isMenuOpen, pathname, prefersReducedMotion]);

  return state;
};

interface UseSectionNavigationParams {
  isClientReady: boolean;
  pathname: string;
  closeMenu: () => void;
}

export const useSectionNavigation = ({
  isClientReady,
  pathname,
  closeMenu,
}: UseSectionNavigationParams): ((sectionId: string) => void) => {
  const router = useRouter();

  return useCallback(
    (sectionId: string) => {
      if (!isClientReady) return;

      if (pathname === "/") {
        if (sectionId === "home") {
          scrollToTop(true);
        } else {
          scrollToSection(sectionId);
        }
      } else {
        setPendingSectionScroll(sectionId);
        router.push(`/#${sectionId}`);
      }

      closeMenu();
    },
    [closeMenu, isClientReady, pathname, router],
  );
};

interface NavbarStylesParams {
  isHeroSection: boolean;
  scrolled: boolean;
  isMenuOpen: boolean;
}

interface NavbarStyles {
  bgClass: string;
  navWidth: string;
  textColorClass: string;
}

export const useNavbarStyles = ({
  isHeroSection,
  scrolled,
  isMenuOpen,
}: NavbarStylesParams): NavbarStyles =>
  useMemo(() => {
    const bgClass =
      !isHeroSection || scrolled || isMenuOpen
        ? "glass-panel"
        : "bg-transparent";

    const navWidth = "w-11/12 md:w-auto md:min-w-[540px]";

    const textColorClass = "text-foreground";

    return { bgClass, navWidth, textColorClass };
  }, [isHeroSection, isMenuOpen, scrolled]);
