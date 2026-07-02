"use client";

import { useCallback } from "react";
import { markSecretFound as markSecretFoundStorage } from "@/lib/easter-eggs/unlock";

export function useEasterEggUnlock() {
  const markFound = useCallback((id: string) => {
    markSecretFoundStorage(id);
  }, []);

  return { markFound };
}
