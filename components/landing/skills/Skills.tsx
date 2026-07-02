"use client";

import React from "react";
import { skillCategories } from "@/lib/content/skillContent";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import {
  SectionShell,
  SectionShellHeader,
} from "@/components/shared/layout/SectionShell";
import { Marquee } from "./Marquee";
import { getIconSlug } from "./utils";
import {
  m,
  useReducedMotion,
  viewportSettings,
  staggerContainerTight,
  fadeUpItem,
} from "@/components/motion";

/** Speed per row (seconds) — stagger slightly for visual variety */
const rowSpeeds = [45, 55, 50, 48];

const Skills: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionShell id="skills" spacing="compact" fullBleed overflowHidden>
      <SectionShellHeader>
        <SectionHeader number="05." title="Skills & Stacks" />
      </SectionShellHeader>

      <m.div
        variants={prefersReducedMotion ? undefined : staggerContainerTight}
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={viewportSettings.once}
        className="flex w-full flex-col border-t border-border/30"
      >
        {skillCategories.map((category, index) => (
          <m.div
            key={category.title}
            variants={prefersReducedMotion ? undefined : fadeUpItem}
            className="group relative overflow-hidden border-b border-border/30"
          >
            <div className="pointer-events-none absolute left-4 top-3 z-10 md:left-8">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:text-xs">
                {category.title}
              </span>
            </div>

            <div className="w-full py-8 pt-12">
              <Marquee
                speed={
                  prefersReducedMotion ? 0 : rowSpeeds[index % rowSpeeds.length]
                }
                direction={index % 2 === 0 ? "left" : "right"}
                pauseOnHover
              >
                <div className="flex items-center gap-12 px-4 md:gap-20 md:px-8">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      className="group/item flex cursor-default items-center gap-3 md:gap-5"
                    >
                      <div className="relative h-8 w-8 opacity-30 grayscale transition-all duration-300 group-hover/item:opacity-100 group-hover/item:grayscale-0 md:h-10 md:w-10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://cdn.simpleicons.org/${getIconSlug(skill)}`}
                          alt={skill}
                          className="h-full w-full object-contain transition-all duration-300 dark:invert dark:group-hover/item:invert-0"
                          loading="lazy"
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="font-sans text-3xl font-bold uppercase tracking-tight text-foreground/20 transition-colors duration-300 group-hover/item:text-foreground md:text-5xl">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </Marquee>
            </div>
          </m.div>
        ))}
      </m.div>
    </SectionShell>
  );
};

export default Skills;
