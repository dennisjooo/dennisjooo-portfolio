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
                                    return;
                                }

                                if (item.id === "home") {
                                    onNavigate("/#home");
                                    return;
                                }

                                onNavigate(`/#${item.id}`);
                            })}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{item.label}</span>
                            {item.href && (
                                <span className="ml-auto font-mono text-[10px] text-muted-foreground/80 uppercase tracking-wider">
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
