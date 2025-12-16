"use client";

import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { CommandGroup, CommandItem } from "@/components/ui/command";

interface ThemeGroupProps {
    onSelect: (command: () => unknown) => void;
}

export function ThemeGroup({ onSelect }: ThemeGroupProps) {
    const { setTheme } = useTheme();

    return (
        <CommandGroup heading="Theme">
            <CommandItem onSelect={() => onSelect(() => setTheme("light"))}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect(() => setTheme("dark"))}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect(() => setTheme("system"))}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
            </CommandItem>
        </CommandGroup>
    );
}
