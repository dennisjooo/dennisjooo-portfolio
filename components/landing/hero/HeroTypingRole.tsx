"use client";

import { HERO_CONTENT } from "@/data/heroContent";
import { useTypingEffect } from "@/lib/hooks/useTypingEffect";
import { BlinkingCursor } from "@/components/shared/BlinkingCursor";
import { useReducedMotion } from "@/components/motion";

export function HeroTypingRole() {
  const prefersReducedMotion = useReducedMotion();
  const description = useTypingEffect(HERO_CONTENT.descriptions, 800, {
    enabled: !prefersReducedMotion,
  });

  return (
    <div
      className="min-w-0 flex-1 max-w-md pr-3 text-left animate-fade-in-up md:max-w-lg md:pr-0 lg:max-w-xl"
      style={{ animationDelay: "1000ms" }}
    >
      <span
        id="hero-role-label"
        className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-foreground/50 md:text-xs lg:text-sm"
      >
        Role
      </span>
      <p
        className="break-words font-mono text-sm font-normal leading-relaxed text-foreground/50 md:text-base lg:text-lg"
        aria-labelledby="hero-role-label"
        aria-live={prefersReducedMotion ? undefined : "polite"}
        aria-atomic="true"
      >
        {description}
        {!prefersReducedMotion && (
          <BlinkingCursor cursor="|" className="opacity-50" />
        )}
      </p>
    </div>
  );
}
