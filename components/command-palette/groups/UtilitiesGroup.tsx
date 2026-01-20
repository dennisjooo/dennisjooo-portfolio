"use client";

import { Copy, Check } from "lucide-react";
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";

interface UtilitiesGroupProps {
    copied: boolean;
    onCopyUrl: () => void;
}

export function UtilitiesGroup({ copied, onCopyUrl }: UtilitiesGroupProps) {
    return (
        <>
            <CommandGroup heading="Utilities">
                <CommandItem onSelect={onCopyUrl} value="Copy URL">
                    {copied ? (
                        <Check className="h-4 w-4 text-accent" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    <span className="font-medium">{copied ? "Copied!" : "Copy Current URL"}</span>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
        </>
    );
}
