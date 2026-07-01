"use client";

import { m, AnimatePresence } from "@/components/motion";
import { useExpandableList } from "@/lib/hooks/data/useExpandableList";
import { cn } from "@/lib/utils";

interface RoleResponsibilitiesListProps {
  responsibilities: string[];
  initialCount?: number;
  itemKeyPrefix?: string;
  variant?: "desktop" | "mobile";
  onToggleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const variantStyles = {
  desktop: {
    list: "space-y-3",
    item: "flex items-start text-lg md:text-xl font-light text-muted-foreground leading-relaxed",
    bullet:
      "mr-4 mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0",
    button:
      "group flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mt-3",
    expandLabel: { more: "Read More", less: "Read Less" },
  },
  mobile: {
    list: "space-y-2",
    item: "flex items-start text-sm font-light text-muted-foreground leading-relaxed",
    bullet: "mr-3 mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0",
    button:
      "flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors pt-1",
    expandLabel: { more: "Show More", less: "Show Less" },
  },
} as const;

export function RoleResponsibilitiesList({
  responsibilities,
  initialCount = 3,
  itemKeyPrefix = "role",
  variant = "desktop",
  onToggleClick,
}: RoleResponsibilitiesListProps) {
  const styles = variantStyles[variant];
  const { isExpanded, toggle, initialItems, expandedItems, hasMore } =
    useExpandableList(responsibilities, initialCount);

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onToggleClick?.(event);
    toggle();
  };

  return (
    <>
      <ul className={styles.list}>
        {initialItems.map((resp, idx) => (
          <li key={`${itemKeyPrefix}-${idx}`} className={styles.item}>
            <span className={styles.bullet} />
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
                transition={{ duration: variant === "mobile" ? 0.15 : 0.3 }}
                className={cn(styles.item, "overflow-hidden")}
              >
                <span className={styles.bullet} />
                <span>{resp}</span>
              </m.li>
            ))}
        </AnimatePresence>
      </ul>

      {hasMore && (
        <button type="button" onClick={handleToggle} className={styles.button}>
          <span>
            {isExpanded ? styles.expandLabel.less : styles.expandLabel.more}
          </span>
          <span
            className={cn(
              "transform transition-transform",
              variant === "mobile" ? "duration-150" : "duration-300",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
          >
            ↓
          </span>
        </button>
      )}
    </>
  );
}
