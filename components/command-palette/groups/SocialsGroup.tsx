"use client";

import { Github, Linkedin, Mail, Globe, ExternalLink } from "lucide-react";
import { CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { contactLinks } from "@/data/contactContent";

interface SocialsGroupProps {
    onSelect: (command: () => unknown) => void;
}

export function SocialsGroup({ onSelect }: SocialsGroupProps) {
    return (
        <>
            <CommandGroup heading="Socials">
                {contactLinks.map((link) => {
                    let Icon = Globe;
                    if (link.icon === 'github') Icon = Github;
                    if (link.icon === 'linkedin') Icon = Linkedin;
                    if (link.icon === 'envelope') Icon = Mail;

                    return (
                        <CommandItem
                            key={link.href}
                            value={link.ariaLabel}
                            onSelect={() => onSelect(() => window.open(link.href, '_blank'))}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="font-medium">{link.ariaLabel}</span>
                            <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground/70" />
                        </CommandItem>
                    );
                })}
            </CommandGroup>
            <CommandSeparator />
        </>
    );
}
