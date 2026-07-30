"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crown } from "lucide-react";
import {
  EASTER_EGG_FOUND_EVENT,
  EASTER_EGG_RESET_EVENT,
  NAV_LOGO_SECRET_ID,
} from "@/lib/easter-eggs/constants";
import { getFoundSecretIds, markSecretFound } from "@/lib/easter-eggs/unlock";
import { siteToast } from "@/lib/ui/siteToast";
import { cn } from "@/lib/utils";

interface NavLogoProps {
  onNavigate: (sectionId: string) => void;
  showCircle: boolean;
}

const TRIPLE_CLICK_WINDOW_MS = 500;

export const NavLogo = ({ onNavigate, showCircle }: NavLogoProps) => {
  const [hasCrown, setHasCrown] = useState(false);
  const [animateCrown, setAnimateCrown] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    setHasCrown(getFoundSecretIds().includes(NAV_LOGO_SECRET_ID));

    const onFound = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (id === NAV_LOGO_SECRET_ID) setHasCrown(true);
    };

    const onReset = () => {
      setHasCrown(false);
      setAnimateCrown(false);
    };

    window.addEventListener(EASTER_EGG_FOUND_EVENT, onFound);
    window.addEventListener(EASTER_EGG_RESET_EVENT, onReset);
    return () => {
      window.removeEventListener(EASTER_EGG_FOUND_EVENT, onFound);
      window.removeEventListener(EASTER_EGG_RESET_EVENT, onReset);
    };
  }, []);

  const unlockCrown = useCallback(() => {
    const alreadyFound = getFoundSecretIds().includes(NAV_LOGO_SECRET_ID);
    if (!alreadyFound) {
      markSecretFound(NAV_LOGO_SECRET_ID);
      siteToast.playful("All hail.", { label: "CROWNED" });
    }
    setHasCrown(true);
    setAnimateCrown(true);
  }, []);

  const handleClick = () => {
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      unlockCrown();
      return;
    }

    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {
        onNavigate("home");
      }
      clickCountRef.current = 0;
    }, TRIPLE_CLICK_WINDOW_MS);
  };

  return (
    <div className="relative shrink-0">
      {hasCrown ? (
        <div
          className="pointer-events-none absolute inset-x-0 -top-2.5 flex justify-center"
          aria-hidden
        >
          <Crown
            className={`h-3.5 w-5 text-accent ${
              animateCrown ? "animate-fade-in-down" : ""
            }`}
          />
        </div>
      ) : null}
      <button
        onClick={handleClick}
        aria-label="Navigate to home"
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ease-in-out",
          showCircle ? "bg-foreground" : "bg-transparent",
        )}
      >
        <span
          className={cn(
            "-ml-[3px] font-caslon text-xs italic leading-none transition-colors duration-200 ease-in-out",
            showCircle ? "text-background" : "text-foreground",
          )}
        >
          DJ
        </span>
      </button>
    </div>
  );
};
