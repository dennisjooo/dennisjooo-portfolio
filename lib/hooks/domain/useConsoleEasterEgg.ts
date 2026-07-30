"use client";

import { useEffect } from "react";
import {
  EASTER_EGG_COMPLETE_EVENT,
  EASTER_EGG_FOUND_EVENT,
} from "@/lib/easter-eggs/constants";
import {
  logConsoleEasterEggs,
  logSecretProgress,
} from "@/lib/easter-eggs/consoleHints";
import { getTotalSecretCount } from "@/lib/easter-eggs/unlock";
import { siteToast } from "@/lib/ui/siteToast";

export function useConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    logConsoleEasterEggs();

    const onSecretFound = () => logSecretProgress();
    window.addEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);

    const onAllSecretsFound = () => {
      const total = getTotalSecretCount();
      siteToast.playful(`You found all ${total} secrets. Absolute legend.`, {
        label: "COMPLETE",
        duration: 5000,
      });
    };
    window.addEventListener(EASTER_EGG_COMPLETE_EVENT, onAllSecretsFound);

    return () => {
      window.removeEventListener(EASTER_EGG_FOUND_EVENT, onSecretFound);
      window.removeEventListener(EASTER_EGG_COMPLETE_EVENT, onAllSecretsFound);
    };
  }, []);
}
