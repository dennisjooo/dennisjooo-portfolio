"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const ViewAllButton = () => {
  return (
    <div className="mt-12 flex w-full justify-center md:mt-16">
      <Link
        href="/blogs"
        prefetch
        className="group relative inline-flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card px-7 py-3 transition-all duration-300 hover:border-accent/40"
      >
        <div className="absolute -inset-px -z-10 rounded-xl bg-accent-border opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-accent">
          All Projects
        </span>

        <ArrowRightIcon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
      </Link>
    </div>
  );
};
