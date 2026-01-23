"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  HomeIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="lg:hidden relative">
      {/* Header Bar */}
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
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                }`}
            />
            <Bars3Icon
              className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"
                }`}
            />
          </div>
        </button>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
      />

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-out ${isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="mx-2 bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden">
          <nav className="p-3 space-y-1">
            {/* Dashboard Home */}
            <Link
              href="/admin"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent transition-all duration-200 group"
            >
              <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-urbanist font-medium tracking-wide">
                Dashboard Home
              </span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-border/50 my-2" />

            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-3 rounded-lg">
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 my-2" />

            {/* Sign Out */}
            <SignOutButton>
              <button
                onClick={closeMenu}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 group"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs uppercase tracking-widest">
                  Sign Out
                </span>
              </button>
            </SignOutButton>

            {/* Exit to Site */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-200 group"
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
