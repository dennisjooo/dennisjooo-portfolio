"use client";

import React, { useState } from "react";
import { skillCategories } from "@/lib/content/skillContent";
import { SectionHeader } from "@/components/shared/layout/SectionHeader";
import { SectionShell } from "@/components/shared/layout/SectionShell";
import { cn } from "@/lib/utils";
import { getIconSlug } from "./utils";

function paddedCount(count: number) {
  return String(count).padStart(2, "0");
}

function CategoryLabel({ title, count }: { title: string; count: number }) {
  return (
    <>
      {title}
      <span
        aria-hidden="true"
        className="ml-2 align-super font-mono text-[0.45em] leading-none text-muted-foreground"
      >
        {paddedCount(count)}
      </span>
      <span className="sr-only">{`, ${count} skills`}</span>
    </>
  );
}

function SkillList({ skills }: { skills: string[] }) {
  return (
    <ul className="grid grid-cols-1 content-start gap-x-8 md:grid-cols-2">
      {skills.map((skill, index) => (
        <li
          key={skill}
          style={{ animationDelay: `${index * 30}ms` }}
          className="group flex animate-skill-row-in items-center gap-3 border-t border-border py-4 font-mono text-sm text-foreground transition-colors duration-200 hover:border-foreground/40 motion-reduce:animate-none md:py-5"
        >
          <span className="relative size-4 shrink-0 opacity-60 grayscale transition duration-200 group-hover:opacity-100 group-hover:grayscale-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://cdn.simpleicons.org/${getIconSlug(skill)}`}
              alt=""
              className="h-full w-full object-contain transition-[filter] duration-200 dark:invert dark:group-hover:invert-0"
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
  const desktopCategory = skillCategories[desktopActive];

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
                <CategoryLabel
                  title={category.title}
                  count={category.skills.length}
                />
              </button>
              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  {open ? (
                    <SkillList key={category.title} skills={category.skills} />
                  ) : null}
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
                <CategoryLabel
                  title={category.title}
                  count={category.skills.length}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="col-span-7 self-start">
          <SkillList
            key={desktopCategory.title}
            skills={desktopCategory.skills}
          />
        </div>
      </div>
    </SectionShell>
  );
};

export default Skills;
