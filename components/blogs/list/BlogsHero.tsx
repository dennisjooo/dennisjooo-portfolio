"use client";

import { AnimatePresence, m, useMotionSafe } from "@/components/motion";

interface BlogsHeroProps {
  activeTab: "blog" | "certifications";
  meta?: string;
}

const tabTitles: Record<"blog" | "certifications", string> = {
  blog: "Blogs",
  certifications: "Certifications",
};

const tabCaptions: Record<"blog" | "certifications", string> = {
  blog: "Crappy writing and half-decent projects, in roughly chronological order.",
  certifications: "Stuff that (supposedly) validates my expertise.",
};

export const BlogsHero = ({ activeTab, meta }: BlogsHeroProps) => {
  const titleExit = useMotionSafe({ opacity: 0 });
  const captionExit = useMotionSafe({ opacity: 0 });
  const titleInitial = useMotionSafe({ opacity: 0 });
  const captionInitial = useMotionSafe({ opacity: 0 });
  const fadeTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <header className="mb-8 w-full md:mb-10">
      <div className="mb-4 flex items-start justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <p>Blog & Certifications</p>
        {meta && <p className="hidden md:block">{meta}</p>}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.h1
          key={activeTab}
          initial={titleInitial ?? false}
          animate={{ opacity: 1 }}
          exit={titleExit}
          transition={titleInitial ? fadeTransition : { duration: 0 }}
          className="mb-4 font-caslon text-6xl italic leading-[1] tracking-tight text-foreground md:text-8xl"
        >
          {tabTitles[activeTab]}
        </m.h1>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <m.p
          key={activeTab}
          initial={captionInitial ?? false}
          animate={{ opacity: 1 }}
          exit={captionExit}
          transition={
            captionInitial
              ? { ...fadeTransition, delay: 0.05 }
              : { duration: 0 }
          }
          className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          {tabCaptions[activeTab]}
        </m.p>
      </AnimatePresence>
    </header>
  );
};
