"use client";

import { cn } from "@/lib/utils";
import {
  m,
  viewportSettings,
  headerStaggerContainer,
  fadeUpItem,
  useInViewReveal,
  useMotionSafe,
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
      <span className="font-mono text-sm text-muted-foreground">{number}</span>
      <span className="font-serif text-2xl text-foreground md:text-3xl">
        {title}
      </span>
    </div>
  );
}

function AnimatedSectionHeader({
  number,
  title,
  className,
}: Pick<SectionHeaderProps, "number" | "title" | "className">) {
  const containerMotion = useInViewReveal(headerStaggerContainer);
  const fadeUp = useMotionSafe(fadeUpItem);

  return (
    <m.div
      {...containerMotion}
      viewport={viewportSettings.once}
      className={cn(
        "relative flex w-full items-end justify-between border-b border-border pb-4",
        className,
      )}
    >
      <m.span
        variants={fadeUp}
        className="font-mono text-sm text-muted-foreground"
      >
        {number}
      </m.span>
      <m.span
        variants={fadeUp}
        className="font-serif text-2xl text-foreground md:text-3xl"
      >
        {title}
      </m.span>
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
            <h2 className="mb-4 font-serif text-4xl leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
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
