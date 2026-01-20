"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
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
                <span className="font-medium">Light</span>
                {theme === "light" && (
                    <span className="ml-auto font-mono text-[10px] text-accent uppercase tracking-wider">Active</span>
                )}
            </CommandItem>
            <CommandItem onSelect={() => onSelect(() => setTheme("dark"))}>
                <Moon className="h-4 w-4" />
                <span className="font-medium">Dark</span>
                {theme === "dark" && (
                    <span className="ml-auto font-mono text-[10px] text-accent uppercase tracking-wider">Active</span>
                )}
            </CommandItem>
            <CommandItem onSelect={() => onSelect(() => setTheme("system"))}>
                <Laptop className="h-4 w-4" />
                <span className="font-medium">System</span>
                {theme === "system" && (
                    <span className="ml-auto font-mono text-[10px] text-accent uppercase tracking-wider">Active</span>
                )}
            </CommandItem>
        </CommandGroup>
    );
}
