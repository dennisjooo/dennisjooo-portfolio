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
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LinkIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Blogs & Projects", href: "/admin/blogs", icon: DocumentTextIcon },
  { name: "Work Experience", href: "/admin/work-experience", icon: BriefcaseIcon },
  { name: "Certifications", href: "/admin/certifications", icon: AcademicCapIcon },
  { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
  { name: "About", href: "/admin/about", icon: IdentificationIcon },
  { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
];

const quickActions = [
  { name: "New Blog Post", href: "/admin/blogs/new", icon: PlusIcon },
  { name: "New Contact", href: "/admin/contacts/new", icon: PlusIcon },
  { name: "New Work Experience", href: "/admin/work-experience/new", icon: PlusIcon },
  { name: "New Certification", href: "/admin/certifications/new", icon: PlusIcon },
];

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

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          {quickActions.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="General">
          <CommandItem
            onSelect={() => runCommand(() => window.open("/", "_blank"))}
          >
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
            <span>Go to Site</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
