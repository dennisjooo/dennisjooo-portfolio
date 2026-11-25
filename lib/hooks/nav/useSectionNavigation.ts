"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { goToSection } from "@/lib/utils/scrollHelpers";

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

      goToSection(sectionId, pathname, router);
      closeMenu();
    },
    [closeMenu, isClientReady, pathname, router],
  );
};
