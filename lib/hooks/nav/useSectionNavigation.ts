"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  scrollToTop,
  scrollToSection,
  setPendingSectionScroll,
} from "@/lib/utils/scrollHelpers";

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
