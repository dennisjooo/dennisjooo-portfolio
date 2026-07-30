"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Crown } from "lucide-react";
import {
  EASTER_EGG_FOUND_EVENT,
  NAV_LOGO_SECRET_ID,
} from "@/lib/easter-eggs/constants";
import { getFoundSecretIds, markSecretFound } from "@/lib/easter-eggs/unlock";
import { siteToast } from "@/lib/ui/siteToast";

interface NavLogoProps {
  onNavigate: (sectionId: string) => void;
}

const TRIPLE_CLICK_WINDOW_MS = 500;

export const NavLogo = ({ onNavigate }: NavLogoProps) => {
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

    window.addEventListener(EASTER_EGG_FOUND_EVENT, onFound);
    return () => window.removeEventListener(EASTER_EGG_FOUND_EVENT, onFound);
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
        <Crown
          className={`absolute -top-2.5 left-1/2 h-3.5 w-5 -translate-x-1/2 text-accent ${
            animateCrown ? "animate-fade-in-down" : ""
          }`}
          aria-hidden
        />
      ) : null}
      <button
        onClick={handleClick}
        aria-label="Navigate to home"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground transition-colors duration-200"
      >
        <span className="-ml-[3px] font-caslon text-xs italic leading-none text-background">
          DJ
        </span>
      </button>
    </div>
  );
};
