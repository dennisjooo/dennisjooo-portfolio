"use client";

import React, { useState } from "react";
import { skillCategories } from "@/lib/content/skillContent";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { cn } from "@/lib/utils";
import { getIconSlug } from "./utils";

function SkillList({ skills }: { skills: string[] }) {
  return (
    <ul className="grid grid-cols-1 content-start gap-x-8 md:grid-cols-2">
      {skills.map((skill) => (
        <li
          key={skill}
          className="flex items-center gap-3 border-t border-border py-4 font-mono text-sm text-foreground md:py-5"
        >
          <span className="relative size-4 shrink-0 opacity-60 grayscale">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${getIconSlug(skill)}`}
              alt=""
              className="h-full w-full object-contain dark:invert"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </span>
          {skill}
        </li>
      ))}
    </ul>
  );
}

const Skills: React.FC = () => {
  const [active, setActive] = useState(0);
  const desktopActive = active < 0 ? 0 : active;

  return (
    <SectionShell id="skills">
      <SectionHeader number="05." title="Skills & Stacks" />

      <ul className="mt-16 divide-y divide-border border-y border-border md:hidden">
        {skillCategories.map((category, i) => {
          const open = i === active;
          const panelId = `skills-panel-${i}`;

          return (
            <li key={category.title}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setActive(open ? -1 : i)}
                className={cn(
                  "w-full py-5 text-left font-serif text-3xl leading-tight tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]",
                  open
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-foreground",
                )}
              >
                {category.title}
              </button>
              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <SkillList skills={category.skills} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-16 hidden grid-cols-12 gap-6 md:grid">
        <ul className="col-span-5 flex flex-col gap-y-8 lg:gap-y-10">
          {skillCategories.map((category, i) => (
            <li key={category.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-current={i === desktopActive}
                className={cn(
                  "cursor-pointer text-left font-serif text-3xl leading-tight tracking-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] md:text-4xl lg:text-5xl",
                  i === desktopActive
                    ? "text-foreground"
                    : "text-muted-foreground/50 hover:text-foreground",
                )}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>

        <div className="col-span-7 grid self-start">
          {skillCategories.map((category, i) => (
            <div
              key={category.title}
              aria-hidden={i !== desktopActive}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-200",
                i === desktopActive
                  ? "opacity-100"
                  : "pointer-events-none opacity-0",
              )}
            >
              <SkillList skills={category.skills} />
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
};

export default Skills;
