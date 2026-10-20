"use client";

import { m } from "@/components/motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <article className="flex h-full flex-col gap-3 border-t border-border pt-5">
        <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <span className="truncate">{issuer}</span>
          <span className="shrink-0">{date}</span>
        </div>

        <h3 className="font-caslon text-xl italic leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent md:text-2xl">
          {title}
        </h3>

        <p className="line-clamp-3 flex-1 font-sans text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-accent" />
      </article>
    </m.a>
  );
};
