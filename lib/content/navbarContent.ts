export interface NavItem {
  id: string;
  label: string;
  href?: string;
}

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
  { id: "blogs", label: "Blog", href: "/blogs" },
];
