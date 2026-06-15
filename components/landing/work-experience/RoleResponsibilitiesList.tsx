"use client";

import { m, AnimatePresence } from "@/components/motion";
import { useExpandableList } from "@/lib/hooks/useExpandableList";

interface RoleResponsibilitiesListProps {
  responsibilities: string[];
  initialCount?: number;
  itemKeyPrefix?: string;
}

export function RoleResponsibilitiesList({
  responsibilities,
  initialCount = 3,
  itemKeyPrefix = "role",
}: RoleResponsibilitiesListProps) {
  const { isExpanded, toggle, initialItems, expandedItems, hasMore } =
    useExpandableList(responsibilities, initialCount);

  return (
    <>
      <ul className="space-y-3">
        {initialItems.map((resp, idx) => (
          <li
            key={`${itemKeyPrefix}-${idx}`}
            className="flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed"
          >
            <span className="mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
            <span>{resp}</span>
          </li>
        ))}

        <AnimatePresence>
          {isExpanded &&
            expandedItems.map((resp, idx) => (
              <m.li
                key={`${itemKeyPrefix}-expanded-${idx}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed overflow-hidden"
              >
                <span className="mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                <span>{resp}</span>
              </m.li>
            ))}
        </AnimatePresence>
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={toggle}
          className="group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-3"
        >
          <span>{isExpanded ? "Read Less" : "Read More"}</span>
          <span
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
          >
            ↓
          </span>
        </button>
      )}
    </>
  );
}
