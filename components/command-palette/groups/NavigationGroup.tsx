"use client";

import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { navItems } from "@/data/navbarContent";
import { getIconForId } from "../commandPaletteUtils";

interface NavigationGroupProps {
    onSelect: (command: () => unknown) => void;
    onNavigate: (path: string) => void;
}

export function NavigationGroup({ onSelect, onNavigate }: NavigationGroupProps) {
    return (
        <>
            <CommandGroup heading="Navigation">
                {navItems.map((item) => {
                    const Icon = getIconForId(item.id);
                    return (
                        <CommandItem
                            key={item.id}
                            keywords={[item.href || `/#${item.id}`, item.label]}
                            value={item.label}
                            onSelect={() => onSelect(() => {
                                if (item.href) {
                                    onNavigate(item.href);
                                } else {
                                    onNavigate(`/#${item.id}`);
                                }
                            })}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                            {item.href && (
                                <span className="ml-auto text-xs text-muted-foreground opacity-50">
                                    {item.href}
                                </span>
                            )}
                        </CommandItem>
                    );
                })}
            </CommandGroup>
            <CommandSeparator />
        </>
    );
}
