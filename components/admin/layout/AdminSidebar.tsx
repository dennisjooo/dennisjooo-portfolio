"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  PowerIcon,
  ArrowTopRightOnSquareIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LinkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton } from "@clerk/nextjs";
import { AdminThemeToggle } from "./AdminThemeToggle";

const navGroups = [
  {
    label: null,
    items: [{ name: "Dashboard", href: "/admin", icon: HomeIcon }],
  },
  {
    label: "Content",
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
    label: "Settings",
    items: [
      { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
      { name: "About", href: "/admin/about", icon: IdentificationIcon },
      { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mounted: boolean;
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mounted,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const isCollapsed = mounted && collapsed;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-border bg-background transition-[width] duration-300 ease-in-out lg:flex ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Brand */}
      <div className="relative border-b border-border py-4">
        {/* Collapsed brand */}
        <div
          className={`flex h-full items-center justify-center transition-opacity duration-200 ${
            isCollapsed
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
          }`}
        >
          <h1 className="font-caslon text-lg italic">DJ</h1>
        </div>
        {/* Expanded brand */}
        <div
          className={`pl-[22px] transition-opacity duration-200 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1 className="whitespace-nowrap font-caslon text-lg italic">
            Dennis Jonathan
          </h1>
          <p className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
            Mission Control
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-3">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label ?? "dashboard"}>
            {group.label && (
              <div className="relative">
                {isCollapsed && groupIndex > 0 && (
                  <div className="absolute inset-x-4 top-2.5 border-t border-border/60" />
                )}
                <div
                  className={`overflow-hidden whitespace-nowrap px-4 pb-1.5 pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-all duration-200 ${
                    isCollapsed ? "h-0 py-0 opacity-0" : "opacity-100"
                  }`}
                >
                  {group.label}
                </div>
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
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center py-2.5 transition-all hover:bg-accent/5 ${
                    isCollapsed
                      ? "justify-center px-0"
                      : "gap-3 border-l-2 pl-[22px] pr-4"
                  } ${
                    isActive
                      ? `bg-accent/5 text-foreground ${isCollapsed ? "" : "border-accent"}`
                      : `text-muted-foreground hover:text-foreground ${isCollapsed ? "" : "border-transparent"}`
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap font-sans text-sm font-medium transition-all duration-200 ${
                      isCollapsed
                        ? "w-0 overflow-hidden opacity-0"
                        : "opacity-100"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="space-y-1 border-t border-border p-3">
        <AdminThemeToggle isCollapsed={isCollapsed} />

        <SignOutButton>
          <button
            className={`flex w-full items-center rounded py-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive ${
              isCollapsed ? "justify-center px-0" : "gap-3 pl-[10px] pr-3"
            }`}
          >
            <PowerIcon className="h-4 w-4 flex-shrink-0" />
            <span
              className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-all duration-200 ${
                isCollapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100"
              }`}
            >
              Sign Out
            </span>
          </button>
        </SignOutButton>

        <Link
          href="/"
          className={`flex w-full items-center rounded py-2 text-muted-foreground transition-all hover:text-foreground ${
            isCollapsed ? "justify-center px-0" : "gap-3 pl-[10px] pr-3"
          }`}
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-shrink-0" />
          <span
            className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-all duration-200 ${
              isCollapsed ? "w-0 overflow-hidden opacity-0" : "opacity-100"
            }`}
          >
            Exit to Site
          </span>
        </Link>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className={`flex w-full items-center rounded py-1.5 text-muted-foreground/50 transition-all hover:text-muted-foreground ${
            isCollapsed ? "justify-center px-0" : "gap-3 pl-[10px] pr-3"
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <>
              <ChevronLeftIcon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap font-mono text-xs uppercase tracking-widest">
                Collapse
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
