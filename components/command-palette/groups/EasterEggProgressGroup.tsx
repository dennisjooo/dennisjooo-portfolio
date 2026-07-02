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
      <CommandGroup heading={`Easter Eggs · ${found}/${total}`} forceMount>
        <CommandItem
          value="easter-egg-progress scavenger hunt secrets hints"
          forceMount
          disabled
          aria-live="polite"
          className="cursor-default select-none flex-col items-stretch gap-2 py-2.5 hover:bg-transparent data-[selected=true]:bg-transparent data-[disabled=true]:opacity-100 data-[disabled=true]:pointer-events-none"
        >
          <div className="w-full rounded-lg border border-border/50 bg-muted/25 px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-border/60">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-foreground/30 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {isComplete ? (
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
              ) : null}
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              {hint}
            </p>
          </div>
        </CommandItem>
      </CommandGroup>
    </>
  );
}
