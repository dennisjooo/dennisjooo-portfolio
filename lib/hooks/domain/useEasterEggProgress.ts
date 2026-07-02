"use client";

import { useCallback, useEffect, useState } from "react";
import { getEasterEggHint } from "@/lib/easter-eggs/hints";
import { EASTER_EGG_FOUND_EVENT } from "@/lib/easter-eggs/constants";
import {
  getFoundSecretIds,
  getTotalSecretCount,
} from "@/lib/easter-eggs/unlock";

interface EasterEggProgress {
  found: number;
  total: number;
  hint: string;
}

function readProgress(): EasterEggProgress {
  const foundIds = getFoundSecretIds();
  return {
    found: foundIds.length,
    total: getTotalSecretCount(),
    hint: getEasterEggHint(foundIds),
  };
}

export function useEasterEggProgress(isOpen: boolean) {
  const [progress, setProgress] = useState<EasterEggProgress>(readProgress);

  const refresh = useCallback(() => {
    setProgress(readProgress());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    refresh();
  }, [isOpen, refresh]);

  useEffect(() => {
    const onFound = () => refresh();
    window.addEventListener(EASTER_EGG_FOUND_EVENT, onFound);
    return () => window.removeEventListener(EASTER_EGG_FOUND_EVENT, onFound);
  }, [refresh]);

  return progress;
}
