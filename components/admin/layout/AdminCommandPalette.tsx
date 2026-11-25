"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { adminCreateActions, adminNavItems } from "@/lib/constants/adminNav";

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." autoFocus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {adminNavItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          {adminCreateActions.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <PlusIcon className="h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem
            onSelect={() => runCommand(() => window.open("/", "_blank"))}
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            <span>Go to Site</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
