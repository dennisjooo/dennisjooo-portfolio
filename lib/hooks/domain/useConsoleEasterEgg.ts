"use client";

import { useEffect } from "react";
import { EASTER_EGG_FOUND_EVENT } from "@/lib/easter-eggs/constants";
import {
  logConsoleEasterEggs,
  logSecretProgress,
} from "@/lib/easter-eggs/consoleHints";

export function useConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    logConsoleEasterEggs();

    const onSecretFound = () => logSecretProgress();
    window.addEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);
    return () =>
      window.removeEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);
  }, []);
}
