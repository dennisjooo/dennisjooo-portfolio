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
                        <Check className="mr-2 h-4 w-4" />
                    ) : (
                        <Copy className="mr-2 h-4 w-4" />
                    )}
                    <span>Copy Current URL</span>
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
        </>
    );
}
