"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { CommandItemLabel } from "../CommandItemLabel";
import { CommandGroup, CommandItem } from "@/components/ui/command";

interface ThemeGroupProps {
  onSelect: (command: () => unknown) => void;
}

export function ThemeGroup({ onSelect }: ThemeGroupProps) {
  const { setTheme, theme } = useTheme();

  return (
    <CommandGroup heading="Theme">
      <CommandItem onSelect={() => onSelect(() => setTheme("light"))}>
        <Sun className="h-4 w-4" />
        <CommandItemLabel>Light</CommandItemLabel>
        {theme === "light" && (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-accent">
            Active
          </span>
        )}
      </CommandItem>
      <CommandItem onSelect={() => onSelect(() => setTheme("dark"))}>
        <Moon className="h-4 w-4" />
        <CommandItemLabel>Dark</CommandItemLabel>
        {theme === "dark" && (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-accent">
            Active
          </span>
        )}
      </CommandItem>
      <CommandItem onSelect={() => onSelect(() => setTheme("system"))}>
        <Laptop className="h-4 w-4" />
        <CommandItemLabel>System</CommandItemLabel>
        {theme === "system" && (
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-accent">
            Active
          </span>
        )}
      </CommandItem>
    </CommandGroup>
  );
}
