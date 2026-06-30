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
        "relative w-full flex justify-between items-end border-b border-border pb-4",
        className,
      )}
    >
      <span className="font-caslon italic text-3xl md:text-4xl text-foreground">
        {number}
      </span>
      <span className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground">
        {title}
      </span>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent" />
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
        "relative w-full flex justify-between items-end border-b border-border pb-4",
        className,
      )}
    >
      <m.span
        variants={prefersReducedMotion ? undefined : fadeUpItem}
        className="font-caslon italic text-3xl md:text-4xl text-foreground"
      >
        {number}
      </m.span>
      <m.span
        variants={prefersReducedMotion ? undefined : fadeUpItem}
        className="font-mono text-xs md:text-sm uppercase tracking-widest opacity-70 text-muted-foreground"
      >
        {title}
      </m.span>
      <m.div
        variants={prefersReducedMotion ? undefined : underlineReveal}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-accent origin-left"
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
            <h2 className="font-caslon italic text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-foreground mb-4">
              {subtitle}
            </h2>
          )}
          {description && (
            <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
