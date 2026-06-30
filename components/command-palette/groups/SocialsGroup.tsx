"use client";

import { ExternalLink } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { resolveContactLinks } from "@/data/defaultContactLinks";
import { CONTACT_ICON_MAP } from "@/lib/constants/contactIcons";
import type { ContactLinkData } from "@/lib/types/contacts";

interface SocialsGroupProps {
  contacts?: ContactLinkData[];
  onSelect: (command: () => unknown) => void;
}

export function SocialsGroup({ contacts, onSelect }: SocialsGroupProps) {
  const links = resolveContactLinks(contacts);

  return (
    <>
      <CommandGroup heading="Socials">
        {links.map((link) => {
          const Icon =
            CONTACT_ICON_MAP[link.icon] ?? CONTACT_ICON_MAP.website;

          return (
            <CommandItem
              key={link.href}
              value={link.ariaLabel}
              onSelect={() => onSelect(() => window.open(link.href, "_blank"))}
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
