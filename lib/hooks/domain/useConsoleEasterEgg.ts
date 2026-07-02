"use client";

import { useEffect } from "react";
import { logConsoleEasterEggs } from "@/lib/easter-eggs/consoleHints";

export function useConsoleEasterEgg() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    logConsoleEasterEggs();
  }, []);
}
