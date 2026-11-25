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
  showMarkFill: boolean;
}

export const useNavbarStyles = ({
  isHeroSection,
  scrolled,
  isMenuOpen,
}: NavbarStylesParams): NavbarStyles =>
  useMemo(() => {
    const filled = !isHeroSection || scrolled || isMenuOpen;

    return {
      bgClass: filled
        ? "border-border bg-background"
        : "border-transparent bg-transparent",
      navWidth: "w-11/12 md:w-auto md:min-w-[540px]",
      textColorClass: "text-foreground",
      showMarkFill: filled,
    };
  }, [isHeroSection, isMenuOpen, scrolled]);

export type { NavbarStyles };
