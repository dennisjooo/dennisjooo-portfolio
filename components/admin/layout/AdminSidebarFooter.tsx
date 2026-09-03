"use client";

import Link from "next/link";
import {
  PowerIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SignOutButton } from "@clerk/nextjs";
import { AdminThemeToggle } from "./AdminThemeToggle";

interface AdminSidebarFooterProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebarFooter({
  isCollapsed,
  onToggle,
}: AdminSidebarFooterProps) {
  return (
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
  );
}
