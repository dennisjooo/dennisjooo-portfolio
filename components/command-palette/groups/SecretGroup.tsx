"use client";

import { Gift } from "lucide-react";
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
                    onSelect={() => onSelect(() => {
                        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank", "noopener,noreferrer");
                    })}
                >
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Claim Free Bitcoin</span>
                </CommandItem>
            </CommandGroup>
        </>
    );
}
