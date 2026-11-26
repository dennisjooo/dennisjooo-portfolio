"use client";

import { AccordionPanel } from "@/components/shared/layout/AccordionPanel";
import { useExpandableList } from "@/lib/hooks/data/useExpandableList";
import { useAccordionAnchor } from "@/lib/hooks/ui/useAccordionAnchor";
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
      "group flex items-center gap-2 text-sm font-mono  text-muted-foreground hover:text-foreground transition-colors mt-3",
    expandLabel: { more: "Read More", less: "Read Less" },
  },
  mobile: {
    list: "space-y-2",
    item: "flex items-start text-base font-light text-muted-foreground leading-relaxed",
    bullet: "mr-3 mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0",
    button:
      "flex items-center gap-2 text-xs font-mono  text-muted-foreground hover:text-foreground transition-colors pt-1",
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
  const keepAnchor = useAccordionAnchor();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    keepAnchor(event.currentTarget, () => {
      onToggleClick?.(event);
      toggle();
    });
  };

  const renderItem = (resp: string, key: string) => (
    <li key={key} className={styles.item}>
      <span className={styles.bullet} />
      <span>{resp}</span>
    </li>
  );

  return (
    <>
      <ul className={styles.list}>
        {initialItems.map((resp, idx) =>
          renderItem(resp, `${itemKeyPrefix}-${idx}`),
        )}
      </ul>

      {hasMore ? (
        <AccordionPanel open={isExpanded} innerClassName="pt-2">
          <ul className={styles.list}>
            {expandedItems.map((resp, idx) =>
              renderItem(resp, `${itemKeyPrefix}-expanded-${idx}`),
            )}
          </ul>
        </AccordionPanel>
      ) : null}

      {hasMore && (
        <button type="button" onClick={handleToggle} className={styles.button}>
          <span>
            {isExpanded ? styles.expandLabel.less : styles.expandLabel.more}
          </span>
          <span
            className={cn(
              "transform transition-transform motion-reduce:transition-none",
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
