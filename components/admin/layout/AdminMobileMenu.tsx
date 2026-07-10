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
  PhotoIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Blogs & Projects", href: "/admin/blogs", icon: DocumentTextIcon },
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
  { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
  { name: "Gallery", href: "/admin/gallery", icon: PhotoIcon },
  { name: "About", href: "/admin/about", icon: IdentificationIcon },
  { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
];

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative lg:hidden">
      <div className="mb-6 flex items-center justify-between border-b border-border px-2 py-4">
        <h1 className="font-caslon text-xl font-bold italic">
          Mission Control
        </h1>
        <button
          onClick={toggleMenu}
          className="rounded-lg bg-card/50 p-2.5 text-muted-foreground transition-all duration-200 hover:bg-card hover:text-foreground"
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
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeMenu}
      />

      <div
        className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ease-out ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}`}
      >
        <div className="mx-2 overflow-hidden rounded-xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl">
          <nav className="space-y-1 p-3">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "" : "transition-transform group-hover:scale-110"}`}
                  />
                  <span className="font-sans font-medium tracking-wide">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <div className="my-2 h-px bg-border/50" />

            <div className="flex items-center justify-between rounded-lg px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <div className="my-2 h-px bg-border/50" />

            <SignOutButton>
              <button
                onClick={closeMenu}
                className="group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Sign Out
                </span>
              </button>
            </SignOutButton>

            <Link
              href="/"
              onClick={closeMenu}
              className="group flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-all duration-200 hover:text-foreground"
            >
              <ArrowLeftStartOnRectangleIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="font-mono text-xs uppercase tracking-widest">
                Exit to Site
              </span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
