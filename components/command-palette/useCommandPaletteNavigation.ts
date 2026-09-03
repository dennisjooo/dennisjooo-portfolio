"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  scrollToTop,
  scrollToSection,
  setPendingSectionScroll,
} from "@/lib/utils/scrollHelpers";

export function useCommandPaletteNavigation(
  router: ReturnType<typeof import("next/navigation").useRouter>,
) {
  const pathname = usePathname() ?? "/";

  const handleNavigate = useCallback(
    (path: string) => {
      if (path.startsWith("/#")) {
        const sectionId = path.slice(2);
        if (pathname === "/") {
          if (sectionId === "home") {
            scrollToTop(true);
          } else {
            scrollToSection(sectionId);
          }
          return;
        }

        setPendingSectionScroll(sectionId);
      }
      router.push(path);
    },
    [pathname, router],
  );

  return handleNavigate;
}
