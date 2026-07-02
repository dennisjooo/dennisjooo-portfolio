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
        <div className="bg-gradient-accent absolute -inset-px rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <article className="relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all duration-500">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors duration-300 group-hover:bg-accent/10">
                <AcademicCapIcon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
              </div>
              <div>
                <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {date}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                  {issuer}
                </span>
              </div>
            </div>
            <ArrowUpRightIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col">
            <h3 className="mb-3 font-sans text-lg font-bold leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-xl">
              {title}
            </h3>

            <p className="flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 border-t border-border pt-4">
            <span className="inline-flex items-center gap-2 font-sans text-sm font-bold text-foreground transition-colors duration-300 group-hover:text-accent">
              View Certificate
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </span>
          </div>
        </article>
      </div>
    </m.a>
  );
};
