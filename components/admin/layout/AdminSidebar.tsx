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
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-border bg-background transition-[width] duration-300 ease-in-out lg:flex ${isCollapsed ? "w-16" : "w-56"
        }`}
    >
      {/* Brand */}
      <div className="relative border-b border-border px-4 py-4">
        {/* Collapsed brand */}
        <div
          className={`flex h-full items-center transition-opacity duration-200 ${isCollapsed
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0"
            }`}
        >
          <h1 className="w-full text-center font-caslon text-lg italic">DJ</h1>
        </div>
        {/* Expanded brand */}
        <div
          className={`transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"
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
        {navGroups.map((group) => (
          <div key={group.label ?? "dashboard"}>
            {group.label && (
              <div
                className={`whitespace-nowrap px-4 pb-1.5 pt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"
                  }`}
              >
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
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 border-l-2 px-4 py-2.5 transition-colors hover:bg-accent/5 ${isActive
                      ? "border-accent bg-accent/5 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`whitespace-nowrap font-sans text-sm font-medium transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"
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
          <button className="flex w-full items-center gap-3 rounded px-3 py-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <PowerIcon className="h-4 w-4 flex-shrink-0" />
            <span
              className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"
                }`}
            >
              Sign Out
            </span>
          </button>
        </SignOutButton>

        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-shrink-0" />
          <span
            className={`whitespace-nowrap font-mono text-xs uppercase tracking-widest transition-opacity duration-200 ${isCollapsed ? "opacity-0" : "opacity-100"
              }`}
          >
            Exit to Site
          </span>
        </Link>

        {/* Toggle */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded py-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeftIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}
