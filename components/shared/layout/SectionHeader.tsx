"use client";

import { cn } from "@/lib/utils";
import {
  m,
  useReducedMotion,
  viewportSettings,
  headerStaggerContainer,
  fadeUpItem,
  underlineReveal,
} from "@/components/motion";

interface SectionHeaderProps {
  number: string;
  title: string;
  animated?: boolean;
  subtitle?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
}

function StaticSectionHeader({
  number,
  title,
  className,
}: Pick<SectionHeaderProps, "number" | "title" | "className">) {
  return (
    <div
      className={cn(
        "relative flex w-full items-end justify-between border-b border-border pb-4",
        className,
      )}
    >
      <span className="font-caslon text-3xl italic text-foreground md:text-4xl">
        {number}
      </span>
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground opacity-70 md:text-sm">
        {title}
      </span>
      <div className="bg-gradient-accent absolute bottom-0 left-0 right-0 h-px" />
    </div>
  );
}

function AnimatedSectionHeader({
  number,
  title,
  className,
}: Pick<SectionHeaderProps, "number" | "title" | "className">) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      variants={prefersReducedMotion ? undefined : headerStaggerContainer}
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={viewportSettings.once}
      className={cn(
        "relative flex w-full items-end justify-between border-b border-border pb-4",
        className,
      )}
    >
      <m.span
        variants={prefersReducedMotion ? undefined : fadeUpItem}
        className="font-caslon text-3xl italic text-foreground md:text-4xl"
      >
        {number}
      </m.span>
      <m.span
        variants={prefersReducedMotion ? undefined : fadeUpItem}
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground opacity-70 md:text-sm"
      >
        {title}
      </m.span>
      <m.div
        variants={prefersReducedMotion ? undefined : underlineReveal}
        className="bg-gradient-accent absolute bottom-0 left-0 right-0 h-px origin-left"
        style={{ boxShadow: "0 0 8px var(--accent-shadow)" }}
      />
    </m.div>
  );
}

export const SectionHeader = ({
  number,
  title,
  animated = true,
  subtitle,
  description,
  className,
  headerClassName,
}: SectionHeaderProps) => {
  const HeaderComponent = animated
    ? AnimatedSectionHeader
    : StaticSectionHeader;

  if (!subtitle && !description) {
    return (
      <HeaderComponent
        number={number}
        title={title}
        className={cn(className, headerClassName)}
      />
    );
  }

  return (
    <div className={cn("mb-16 md:mb-10", className)}>
      <HeaderComponent
        number={number}
        title={title}
        className={cn("mb-6", headerClassName)}
      />

      {(subtitle || description) && (
        <div className="relative w-full select-none pt-6">
          {subtitle && (
            <h2 className="mb-4 font-caslon text-4xl italic leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="max-w-xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
