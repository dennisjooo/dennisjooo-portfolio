"use client";

import { Sparkles } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { executeSecretAction } from "@/lib/easter-eggs/executeSecretAction";
import { markSecretFound } from "@/lib/easter-eggs/unlock";
import type { SecretDefinition } from "@/lib/easter-eggs/types";

interface SecretGroupProps {
  secrets: SecretDefinition[];
  onSelect: (command: () => unknown) => void;
}

export function SecretGroup({ secrets, onSelect }: SecretGroupProps) {
  if (secrets.length === 0) return null;

  return (
    <>
      <CommandSeparator />
      <CommandGroup heading="Secret">
        {secrets.map((secret) => {
          const Icon = secret.icon;

          return (
            <CommandItem
              key={secret.id}
              value={secret.searchValue}
              className="bg-gradient-to-r from-accent/10 to-transparent"
              onSelect={() =>
                onSelect(() => {
                  markSecretFound(secret.id);
                  void executeSecretAction(secret.action);
                })
              }
            >
              <Icon className="h-4 w-4 text-accent" />
              <span className="font-medium text-display">{secret.label}</span>
              <Sparkles className="ml-auto h-3 w-3 text-accent animate-pulse" />
            </CommandItem>
          );
        })}
      </CommandGroup>
    </>
  );
}
