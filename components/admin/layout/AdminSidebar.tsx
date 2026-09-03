"use client";

import { AdminSidebarBrand } from "./AdminSidebarBrand";
import { AdminSidebarNav } from "./AdminSidebarNav";
import { AdminSidebarFooter } from "./AdminSidebarFooter";

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
  const isCollapsed = mounted && collapsed;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen flex-col overflow-hidden border-r border-border bg-background transition-[width] duration-300 ease-in-out lg:flex ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <AdminSidebarBrand isCollapsed={isCollapsed} />
      <AdminSidebarNav isCollapsed={isCollapsed} />
      <AdminSidebarFooter isCollapsed={isCollapsed} onToggle={onToggle} />
    </aside>
  );
}
