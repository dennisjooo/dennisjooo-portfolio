"use client";

import { m } from "@/components/motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { BsGithub } from "react-icons/bs";

interface Link {
  url: string;
  text: string;
}

interface ProjectLinksProps {
  links: Link[];
}

export default function ProjectLinks({ links }: ProjectLinksProps) {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Resources
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Links Grid */}
      <nav className="flex flex-wrap gap-4">
        {links.map((link, index) => (
          <ProjectLink key={index} index={index} {...link} />
        ))}
      </nav>
    </div>
  );
}

function ProjectLink({ url, text, index }: Link & { index: number }) {
  const isGitHubLink = url.toLowerCase().includes("github.com");

  return (
    <m.a
      href={url}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group inline-block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative">
        <div className="absolute -inset-px rounded-lg bg-accent-border opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="relative inline-flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-3 transition-colors duration-500">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-colors duration-300 group-hover:bg-accent/10">
            {isGitHubLink ? (
              <BsGithub className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            ) : (
              <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent" />
            )}
          </span>

          <span className="font-sans text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-accent">
            {text}
          </span>

          <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </span>
      </div>
    </m.a>
  );
}
