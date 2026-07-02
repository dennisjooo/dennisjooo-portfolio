"use client";

import {
  AnimatePresence,
  m,
  springConfigs,
  useReducedMotion,
} from "@/components/motion";

interface BlogsHeroProps {
  activeTab: "blog" | "certifications";
}

const tabTitles: Record<"blog" | "certifications", string> = {
  blog: "Blogs",
  certifications: "Certifications",
};

const tabCaptions: Record<"blog" | "certifications", string> = {
  blog: "Things I've built and written about (mostly coherent).",
  certifications: "Stuff that (supposedly) validates my expertise.",
};

export const BlogsHero = ({ activeTab }: BlogsHeroProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <header className="mb-8 w-full md:mb-10">
      <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Blog & Certifications
      </p>

      <AnimatePresence mode="wait">
        <m.h1
          key={activeTab}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, x: 24 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : springConfigs.snappy
          }
          className="mb-4 font-caslon text-4xl italic leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl"
        >
          {tabTitles[activeTab]}
        </m.h1>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <m.p
          key={activeTab}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { ...springConfigs.snappy, delay: 0.05 }
          }
          className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {tabCaptions[activeTab]}
        </m.p>
      </AnimatePresence>
    </header>
  );
};
