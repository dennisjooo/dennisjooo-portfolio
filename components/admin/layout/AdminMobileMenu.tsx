"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme";
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LinkIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navGroups = [
  {
    label: null,
    items: [{ name: "Dashboard", href: "/admin", icon: HomeIcon }],
  },
  {
    label: "01 — Content",
    items: [
      {
        name: "Blogs & Projects",
        href: "/admin/blogs",
        icon: DocumentTextIcon,
      },
      {
        name: "Work Experience",
        href: "/admin/work-experience",
        icon: BriefcaseIcon,
      },
      {
        name: "Certifications",
        href: "/admin/certifications",
        icon: AcademicCapIcon,
      },
    ],
  },
  {
    label: "02 — Settings",
    items: [
      { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
      { name: "About", href: "/admin/about", icon: IdentificationIcon },
      { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
    ],
  },
];

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative lg:hidden">
      <div className="mb-6 flex items-center justify-between border-b border-border px-2 py-4">
        <div>
          <h1 className="font-caslon text-lg italic">Dennis Jonathan</h1>
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
            Mission Control
          </p>
        </div>
        <button
          onClick={toggleMenu}
          className="rounded-lg border border-border p-2.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle menu"
        >
          <div className="relative h-5 w-5">
            <XMarkIcon
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
            />
            <Bars3Icon
              className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${isOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
            />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-background/80 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
      />

      <div
        className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ease-out ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="mx-2 overflow-hidden rounded-lg border border-border bg-background">
          <div className="border-b border-border p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              Mission Control
            </p>
          </div>

          <nav className="p-3 pt-5">
            {navGroups.map((group) => (
              <div key={group.label ?? "dashboard"}>
                {group.label && (
                  <div className="px-4 pb-1 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    {group.label}
                  </div>
                )}
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 border-l-2 px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
                        isActive
                          ? "border-accent bg-accent/5 text-foreground"
                          : "border-transparent text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}

            <div className="my-3 h-px bg-border" />

            <div className="flex items-center justify-between px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <div className="my-3 h-px bg-border" />

            <SignOutButton>
              <button
                onClick={closeMenu}
                className="flex w-full items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </SignOutButton>

            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
              <span>Exit to Site</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
