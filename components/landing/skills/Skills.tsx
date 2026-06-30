"use client";

import React from "react";
import { skillCategories } from "@/data/skillContent";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  SectionShell,
  SectionShellHeader,
} from "@/components/shared/SectionShell";
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
        className="w-full flex flex-col border-t border-border/30"
      >
        {skillCategories.map((category, index) => (
          <m.div
            key={category.title}
            variants={prefersReducedMotion ? undefined : fadeUpItem}
            className="relative group border-b border-border/30 overflow-hidden"
          >
            <div className="absolute top-3 left-4 md:left-8 z-10 pointer-events-none">
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
                {category.title}
              </span>
            </div>

            <div className="py-8 pt-12 w-full">
              <Marquee
                speed={
                  prefersReducedMotion ? 0 : rowSpeeds[index % rowSpeeds.length]
                }
                direction={index % 2 === 0 ? "left" : "right"}
                pauseOnHover
              >
                <div className="flex items-center gap-12 md:gap-20 px-4 md:px-8">
                  {category.skills.map((skill) => (
                    <div
                      key={skill}
                      className="group/item flex items-center gap-3 md:gap-5 cursor-default"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 relative grayscale opacity-30 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://cdn.simpleicons.org/${getIconSlug(skill)}`}
                          alt={skill}
                          className="w-full h-full object-contain dark:invert dark:group-hover/item:invert-0 transition-all duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="text-3xl md:text-5xl font-bold font-sans uppercase tracking-tight text-foreground/20 group-hover/item:text-foreground transition-colors duration-300">
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
