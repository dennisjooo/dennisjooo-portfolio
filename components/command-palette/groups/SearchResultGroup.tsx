"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CommandItemLabel } from "../CommandItemLabel";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  highlightSearchTerm,
  type SearchOptions,
} from "@/lib/command-palette/utils";

interface SearchResultGroupProps<T> {
  heading: string;
  items: T[];
  searchTerm: string;
  searchOptions: SearchOptions;
  icon: LucideIcon;
  getKey: (item: T) => string;
  getValue: (item: T) => string;
  renderPrimary: (item: T) => ReactNode;
  renderBadge?: (item: T) => ReactNode;
  renderSecondary?: (item: T) => ReactNode;
  getContext?: (item: T) => string | null;
  onSelect: (command: () => unknown) => void;
  onItemSelect: (item: T) => void;
}

export function SearchResultGroup<T>({
  heading,
  items,
  searchTerm,
  searchOptions,
  icon: Icon,
  getKey,
  getValue,
  renderPrimary,
  renderBadge,
  renderSecondary,
  getContext,
  onSelect,
  onItemSelect,
}: SearchResultGroupProps<T>) {
  if (items.length === 0) return null;

  return (
    <>
      <CommandGroup heading={heading} forceMount>
        {items.map((item) => {
          const context = getContext?.(item);

          return (
            <CommandItem
              key={getKey(item)}
              value={getValue(item)}
              forceMount
              onSelect={() => onSelect(() => onItemSelect(item))}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <div className="flex items-center gap-2">
                  <CommandItemLabel className="truncate">
                    {renderPrimary(item)}
                  </CommandItemLabel>
                  {renderBadge?.(item)}
                </div>
                {renderSecondary?.(item)}
                {context && (
                  <span
                    className="mt-0.5 block max-w-full truncate text-xs text-muted-foreground/70"
                    dangerouslySetInnerHTML={{
                      __html: highlightSearchTerm(
                        context,
                        searchTerm,
                        searchOptions,
                      ),
                    }}
                  />
                )}
              </div>
            </CommandItem>
          );
        })}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
}
