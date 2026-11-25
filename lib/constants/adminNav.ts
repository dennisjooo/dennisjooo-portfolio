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
  create?: {
    href: string;
    label: string;
  };
  countApi?: string;
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
        countApi: "/api/blogs",
        create: { href: "/admin/blogs/new", label: "New Post" },
      },
      {
        name: "Work Experience",
        href: "/admin/work-experience",
        icon: BriefcaseIcon,
        description: "Career timeline and professional roles.",
        stat: "View All",
        countApi: "/api/work-experience",
        create: {
          href: "/admin/work-experience/new",
          label: "New Experience",
        },
      },
      {
        name: "Certifications",
        href: "/admin/certifications",
        icon: AcademicCapIcon,
        description: "Licenses, credentials, and achievements.",
        stat: "View All",
        countApi: "/api/certifications",
        create: {
          href: "/admin/certifications/new",
          label: "New Certification",
        },
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
        countApi: "/api/contacts",
        create: { href: "/admin/contacts/new", label: "New Contact" },
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
  const labeled = adminNavGroups.filter((group) => group.label);
  const index = labeled.findIndex((group) => group.label === label);
  if (index === -1) return label;
  return `${String(index + 1).padStart(2, "0")} — ${label}`;
}

export const adminNavItems = adminNavGroups.flatMap((group) => group.items);

export const adminCreateActions = adminNavItems.flatMap((item) =>
  item.create ? [{ ...item.create, icon: item.icon }] : [],
);

export const adminCountEndpoints = adminNavItems.flatMap((item) =>
  item.countApi ? [{ key: item.href, url: `${item.countApi}?limit=1` }] : [],
);

export const adminDashboardCards = adminNavItems
  .filter((item) => item.href !== "/admin")
  .map((item) => ({
    title: item.dashboardTitle ?? item.name,
    description: item.description ?? "",
    href: item.href,
    icon: item.icon,
    stat: item.stat ?? "View All",
  }));
