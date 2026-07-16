"use client";

import Link from "next/link";
import { m } from "@/components/motion";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { itemVariants } from "./constants";

interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  stat?: string;
}

export function NavigationCard({
  title,
  description,
  href,
  icon: Icon,
  stat,
}: NavigationCardProps) {
  return (
    <m.div variants={itemVariants}>
      <Link href={href} className="group relative block h-full">
        <div className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors duration-300 hover:border-accent/40">
          <div className="mb-4 flex items-start justify-between">
            <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            <ArrowRightIcon className="mt-0.5 h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
          </div>

          <h2 className="mb-1.5 font-caslon text-xl font-medium italic transition-colors duration-300 group-hover:text-accent">
            {title}
          </h2>

          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-4 border-t border-border/50 pt-4">
            {stat === undefined ? (
              <div className="h-3 w-16 animate-pulse rounded bg-muted/40" />
            ) : (
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {stat}
              </span>
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}
