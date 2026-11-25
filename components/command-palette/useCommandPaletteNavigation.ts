"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { goToSection } from "@/lib/utils/scrollHelpers";

export function useCommandPaletteNavigation(
  router: ReturnType<typeof import("next/navigation").useRouter>,
) {
  const pathname = usePathname() ?? "/";

  const handleNavigate = useCallback(
    (path: string) => {
      if (path.startsWith("/#")) {
        goToSection(path.slice(2), pathname, router);
        return;
      }
      router.push(path);
    },
    [pathname, router],
  );

  return handleNavigate;
}
