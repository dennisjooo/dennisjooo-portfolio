"use client";

import { AnimatePresence, m, useMotionSafe } from "@/components/motion";
import type { BlogsListTab } from "@/lib/constants/blogsList";

interface BlogsHeroProps {
  activeTab: BlogsListTab;
  meta?: string;
}

const tabTitles: Record<BlogsListTab, string> = {
  blog: "Blogs",
  certifications: "Certifications",
};

const tabCaptions: Record<BlogsListTab, string> = {
  blog: "Crappy writing and half-decent projects, in roughly chronological order.",
  certifications: "Stuff that (supposedly) validates my expertise.",
};

const titleClassName =
  "font-serif text-6xl leading-[1] tracking-tight text-foreground md:text-8xl";
const captionClassName =
  "font-sans text-base leading-relaxed text-muted-foreground md:text-lg";

export const BlogsHero = ({ activeTab, meta }: BlogsHeroProps) => {
  const titleExit = useMotionSafe({ opacity: 0 });
  const captionExit = useMotionSafe({ opacity: 0 });
  const titleInitial = useMotionSafe({ opacity: 0 });
  const captionInitial = useMotionSafe({ opacity: 0 });
  const fadeTransition = { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <header className="mb-8 w-full md:mb-10">
      <div className="mb-4 flex items-start justify-between font-mono text-xs text-muted-foreground md:text-sm">
        <p>Blog & Certifications</p>
        {meta && <p className="hidden md:block">{meta}</p>}
      </div>

      <div className="relative mb-4">
        <div className="invisible grid" aria-hidden>
          {Object.values(tabTitles).map((title) => (
            <span
              key={title}
              className={`col-start-1 row-start-1 ${titleClassName}`}
            >
              {title}
            </span>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <m.h1
            key={activeTab}
            initial={titleInitial ?? false}
            animate={{ opacity: 1 }}
            exit={titleExit}
            transition={titleInitial ? fadeTransition : { duration: 0 }}
            className={`absolute inset-0 ${titleClassName}`}
          >
            {tabTitles[activeTab]}
          </m.h1>
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="invisible grid" aria-hidden>
          {Object.values(tabCaptions).map((caption) => (
            <p
              key={caption}
              className={`col-start-1 row-start-1 ${captionClassName}`}
            >
              {caption}
            </p>
          ))}
        </div>
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
            className={`absolute inset-0 ${captionClassName}`}
          >
            {tabCaptions[activeTab]}
          </m.p>
        </AnimatePresence>
      </div>
    </header>
  );
};
