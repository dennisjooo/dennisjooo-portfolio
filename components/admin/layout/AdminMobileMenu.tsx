"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  adminNavGroups,
  formatMobileNavGroupLabel,
} from "@/lib/constants/adminNav";

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={`z-30 mb-6 lg:hidden ${isOpen ? "fixed inset-x-6 top-6 md:inset-x-10 md:top-10" : "relative"}`}
    >
      <div
        className={`fixed inset-0 z-0 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
      />
      <div
        className={`relative z-10 rounded-2xl border border-border bg-background transition-all duration-200 ease-in-out ${isOpen ? "rounded-b-none border-b-0" : ""}`}
      >
        <div className="flex items-center justify-between px-4 py-4">
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
            aria-expanded={isOpen}
          >
            <div className="relative h-5 w-5">
              <XMarkIcon
                className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
              />
              <Bars3Icon
                className={`absolute inset-0 h-5 w-5 transition-all duration-200 ${isOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-full z-10 overflow-hidden rounded-b-2xl border border-t-0 border-border bg-background transition-all duration-200 ease-out ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
        aria-hidden={!isOpen}
      >
        <nav className="border-t border-border p-3">
          {adminNavGroups.map((group) => {
            const groupLabel = formatMobileNavGroupLabel(group.label);
            return (
              <div key={group.label ?? "dashboard"}>
                {groupLabel && (
                  <div className="px-4 pb-1 pt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    {groupLabel}
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
                      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-accent/10 text-foreground"
                          : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}

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
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>

          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            <ArrowLeftStartOnRectangleIcon className="h-4 w-4" />
            <span>Exit to Site</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
