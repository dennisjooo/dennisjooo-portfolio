"use client";

import { Sparkles } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useEasterEggProgress } from "@/lib/hooks/domain/useEasterEggProgress";

interface EasterEggProgressGroupProps {
  open: boolean;
}

export function EasterEggProgressGroup({ open }: EasterEggProgressGroupProps) {
  const { found, total, hint } = useEasterEggProgress(open);
  const progress = total > 0 ? (found / total) * 100 : 0;
  const isComplete = found >= total;

  return (
    <>
      <CommandSeparator alwaysRender />
      <CommandGroup
        heading={`Easter Eggs · ${found}/${total}`}
        forceMount
        className="[&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-1.5"
      >
        <CommandItem
          value="easter-egg-progress scavenger hunt secrets hints"
          forceMount
          disabled
          aria-live="polite"
          className="cursor-default select-none !py-1.5 flex-col items-stretch gap-1.5 hover:bg-transparent data-[selected=true]:bg-transparent data-[disabled=true]:opacity-100 data-[disabled=true]:pointer-events-none"
        >
          <div className="flex items-center gap-2 w-full">
            <div className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-border/60">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground/30 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {isComplete ? (
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
            ) : null}
          </div>
          <p className="font-mono text-[11px] leading-snug text-muted-foreground w-full">
            {hint}
          </p>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
