"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl lg:flex">
      <div className="border-b border-border p-8">
        <h1 className="font-caslon text-2xl italic">
          Dennis' Portfolio{" "}
          <span className="mt-1 block font-sans text-sm font-bold uppercase not-italic tracking-widest text-muted-foreground">
            Mission Control
          </span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
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
      </nav>

      <div className="border-t border-border p-4">
        {/* Theme Toggle */}
        <ThemeToggle className="ml-4 mt-2" />

        {/* Sign Out */}
        <SignOutButton>
          <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            <span className="font-mono text-xs uppercase tracking-widest">
              Sign Out
            </span>
          </button>
        </SignOutButton>

        <Link
          href="/"
          className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Exit to Site
          </span>
        </Link>
      </div>
    </aside>
  );
}
