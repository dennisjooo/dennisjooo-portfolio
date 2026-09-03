"use client";

import { useMemo } from "react";

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

export type { NavbarStyles };
