"use client";

import { Gift, Sparkles } from "lucide-react";
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";

interface SecretGroupProps {
    show: boolean;
    onSelect: (command: () => unknown) => void;
}

export function SecretGroup({ show, onSelect }: SecretGroupProps) {
    if (!show) return null;

    return (
        <>
            <CommandSeparator />
            <CommandGroup heading="Secret">
                <CommandItem
                    value="free bitcoin rickroll"
                    className="bg-gradient-to-r from-accent/10 to-transparent"
                    onSelect={() => onSelect(() => {
                        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");
                    })}
                >
                    <Gift className="h-4 w-4 text-accent" />
                    <span className="font-medium text-gradient-primary bg-clip-text">Claim Free Bitcoin</span>
                    <Sparkles className="ml-auto h-3 w-3 text-accent animate-pulse" />
                </CommandItem>
            </CommandGroup>
        </>
    );
}
