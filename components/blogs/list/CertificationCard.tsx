"use client";

import { m } from "@/components/motion";
import { ArrowUpRightIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import type { Certification } from "@/lib/db";

interface CertificationCardProps {
  certification: Certification;
  index: number;
}

export const CertificationCard = ({
  certification,
  index,
}: CertificationCardProps) => {
  const { title, issuer, date, description, link } = certification;

  return (
    <m.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="relative h-full">
        <div className="absolute -inset-px rounded-xl bg-accent-border opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-300 group-hover:border-foreground/30">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 md:px-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors duration-300 group-hover:bg-accent/10">
              <AcademicCapIcon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            </div>
            <span className="max-w-[70%] truncate rounded border border-border bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {issuer}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
            <h3 className="font-caslon text-xl italic leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
              {title}
            </h3>

            <p className="line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {date}
              </span>
              <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
          </div>
        </article>
      </div>
    </m.a>
  );
};
