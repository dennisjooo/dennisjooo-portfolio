"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const ViewAllButton = () => {
  return (
    <div className="w-full flex justify-center mt-20 md:mt-10">
      <Link
        href="/blogs"
        prefetch
        className="group relative inline-flex items-center gap-4 px-7 py-3 rounded-xl cursor-pointer
                           border border-border bg-card
                           hover:border-accent/40
                           transition-all duration-300"
      >
        {/* Gradient border glow — matches ContentCard */}
        <div className="absolute -inset-px bg-gradient-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-accent transition-colors duration-300">
          All Projects
        </span>

        <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-300" />
      </Link>
    </div>
  );
};
