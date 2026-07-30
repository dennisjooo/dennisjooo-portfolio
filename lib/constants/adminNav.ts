import type { ComponentType } from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export type AdminNavItem = {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  dashboardTitle?: string;
  description?: string;
  stat?: string;
};

export type AdminNavGroup = {
  label: string | null;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
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
        dashboardTitle: "Editorial Content",
        description: "Posts, projects, and long-form writing.",
        stat: "Manage Posts",
      },
      {
        name: "Work Experience",
        href: "/admin/work-experience",
        icon: BriefcaseIcon,
        description: "Career timeline and professional roles.",
        stat: "View All",
      },
      {
        name: "Certifications",
        href: "/admin/certifications",
        icon: AcademicCapIcon,
        description: "Licenses, credentials, and achievements.",
        stat: "View All",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        name: "Contacts",
        href: "/admin/contacts",
        icon: LinkIcon,
        description: "Social links and contact channels.",
        stat: "View All",
      },
      {
        name: "About",
        href: "/admin/about",
        icon: IdentificationIcon,
        description: "Bio, introduction, and personal details.",
        stat: "Edit",
      },
      {
        name: "Profile",
        href: "/admin/profile",
        icon: UserCircleIcon,
        dashboardTitle: "Profile Config",
        description: "Site settings and preferences.",
        stat: "Settings",
      },
    ],
  },
];

export function formatMobileNavGroupLabel(label: string | null): string | null {
  if (!label) return null;
  if (label === "Content") return "01 — Content";
  if (label === "Settings") return "02 — Settings";
  return label;
}

export const adminDashboardCards = adminNavGroups
  .flatMap((group) => group.items)
  .filter((item) => item.href !== "/admin")
  .map((item) => ({
    title: item.dashboardTitle ?? item.name,
    description: item.description ?? "",
    href: item.href,
    icon: item.icon,
    stat: item.stat ?? "View All",
  }));
