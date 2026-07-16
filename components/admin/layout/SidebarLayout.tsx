"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored) setCollapsed(JSON.parse(stored));
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <>
      <AdminSidebar collapsed={collapsed} onToggle={toggle} mounted={mounted} />
      <main
        className={`relative z-10 min-h-screen min-w-0 flex-1 p-6 transition-[margin] duration-300 ease-in-out md:p-10 lg:p-14 ${
          mounted ? (collapsed ? "lg:ml-16" : "lg:ml-56") : "lg:ml-56"
        }`}
      >
        {children}
      </main>
    </>
  );
}
