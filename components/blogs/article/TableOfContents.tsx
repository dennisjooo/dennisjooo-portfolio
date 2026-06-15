"use client";

import { useState } from "react";
import { m } from "@/components/motion";
import { Heading } from "@/lib/utils/markdownHelpers";
import { useActiveHeading } from "@/lib/hooks/useActiveHeading";
import {
  getDisplayActiveId,
  handleTocClick,
} from "@/lib/utils/tableOfContents";
import { SCROLL_ANIMATION_DURATION } from "@/lib/constants/scrolling";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isManualClick, setIsManualClick] = useState(false);
  const { activeId, setActiveId } = useActiveHeading(headings);

  const minLevel = Math.min(...headings.map((h) => h.level));

  const displayActiveId = isManualClick
    ? activeId
    : getDisplayActiveId(activeId, headings, isHovered);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setIsManualClick(true);

    setTimeout(() => {
      setIsManualClick(false);
    }, SCROLL_ANIMATION_DURATION);

    handleTocClick(e, id, setActiveId);
  };

  if (headings.length === 0) return null;

  return (
    <div className="fixed right-6 inset-y-0 z-10 hidden lg:flex items-center">
      <m.nav
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-3 rounded-2xl transition-all duration-300 ${
          isHovered
            ? "bg-muted/80 backdrop-blur-md border border-border shadow-lg w-[280px]"
            : "bg-transparent border border-transparent"
        }`}
      >
        <m.span
          className="absolute -top-8 left-0 font-mono text-[10px] uppercase tracking-widest text-muted-foreground pl-3"
          style={{
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          On this page
        </m.span>

        <ul className="relative">
          {headings.map((heading, index) => {
            const isActive = displayActiveId === heading.id;
            const indent = (heading.level - minLevel) * 12;
            const isVisible = isHovered || heading.level === minLevel;

            const firstVisibleIndex = isHovered
              ? 0
              : headings.findIndex((h) => h.level === minLevel);

            const isFirstVisible = index === firstVisibleIndex;

            return (
              <li
                key={heading.id}
                className="relative flex items-center transition-all duration-300 ease-in-out"
                style={{
                  paddingLeft: `${indent}px`,
                  maxHeight: isVisible ? "40px" : "0px",
                  opacity: isVisible ? 1 : 0,
                  marginTop: isVisible && !isFirstVisible ? "10px" : "0px",
                  overflow: "hidden",
                }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className="group flex items-center gap-3"
                >
                  <div
                    className={`h-px transition-all duration-300 ease-in-out ${
                      isActive
                        ? "bg-accent"
                        : "bg-border group-hover:bg-muted-foreground"
                    }`}
                    style={{
                      width: isActive ? "24px" : "12px",
                    }}
                  />

                  <span
                    className={`font-sans text-sm truncate transition-all duration-300 ease-in-out ${
                      isActive
                        ? "text-accent font-medium"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                    style={{
                      width: isHovered ? "200px" : "0px",
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    {heading.text}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </m.nav>
    </div>
  );
}
