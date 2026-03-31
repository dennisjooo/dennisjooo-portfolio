"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Blogs & Projects", href: "/admin/blogs", icon: DocumentTextIcon },
  { name: "Work Experience", href: "/admin/work-experience", icon: BriefcaseIcon },
  { name: "Certifications", href: "/admin/certifications", icon: AcademicCapIcon },
  { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
  { name: "About", href: "/admin/about", icon: IdentificationIcon },
  { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
];

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden relative">
      <div className="flex items-center justify-between py-4 px-2 border-b border-border mb-6">
        <h1 className="font-playfair italic text-xl font-bold">
          Mission Control
        </h1>
        <button
          onClick={toggleMenu}
          className="p-2.5 rounded-lg bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200"
          aria-label="Toggle menu"
        >
          <div className="relative w-5 h-5">
            <XMarkIcon
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
            />
            <Bars3Icon
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
            />
          </div>
        </button>
      </div>

      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeMenu}
      />

      <div
        className={`absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="mx-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden">
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                  <span className="font-sans font-medium tracking-wide">{item.name}</span>
                </Link>
              );
            })}

            <div className="h-px bg-border/50 my-2" />

            <div className="flex items-center justify-between px-4 py-3 rounded-lg">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>

            <div className="h-px bg-border/50 my-2" />

            <SignOutButton>
              <button
                onClick={closeMenu}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 group"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs uppercase tracking-widest">Sign Out</span>
              </button>
            </SignOutButton>

            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 group"
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs uppercase tracking-widest">Exit to Site</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
