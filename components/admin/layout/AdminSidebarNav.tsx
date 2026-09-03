"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "@/lib/constants/adminNav";

interface AdminSidebarNavProps {
  isCollapsed: boolean;
}

export function AdminSidebarNav({ isCollapsed }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-3">
      {adminNavGroups.map((group, groupIndex) => (
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
  );
}
