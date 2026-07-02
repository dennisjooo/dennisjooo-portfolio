"use client";

import { useConsoleEasterEgg } from "@/lib/hooks/domain/useConsoleEasterEgg";
import { useEasterEggUnlock } from "@/lib/hooks/domain/useEasterEggUnlock";

export function EasterEggs() {
  useConsoleEasterEgg();
  useEasterEggUnlock();

  return null;
}
