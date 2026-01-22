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
} from "@heroicons/react/24/outline";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Blogs & Projects", href: "/admin/blogs", icon: DocumentTextIcon },
  { name: "Work Experience", href: "/admin/work-experience", icon: BriefcaseIcon },
  { name: "Certifications", href: "/admin/certifications", icon: AcademicCapIcon },
  { name: "Contacts", href: "/admin/contacts", icon: LinkIcon },
  { name: "About", href: "/admin/about", icon: IdentificationIcon },
  { name: "Profile", href: "/admin/profile", icon: UserCircleIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden lg:flex flex-col">
      <div className="p-8 border-b border-border">
        <h1 className="font-playfair italic text-2xl font-bold">
          Dennis' Portfolio <span className="font-sans not-italic text-sm tracking-widest uppercase block mt-1 text-muted-foreground">Mission Control</span>
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "hover:bg-accent/10 hover:text-accent"
                }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
              <span className="font-urbanist font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {/* Theme Toggle */}
        <ThemeToggle className="mt-2 ml-4" />

        {/* Sign Out */}
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </SignOutButton>

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-widest">Exit to Site</span>
        </Link>
      </div>
    </aside>
  );
}
