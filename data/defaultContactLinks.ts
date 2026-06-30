import type { ContactLinkData } from "@/lib/types/contacts";

export const defaultContactLinks: ContactLinkData[] = [
  {
    href: "mailto:dennisjonathan78@gmail.com",
    ariaLabel: "Email",
    icon: "mail",
  },
  {
    href: "https://github.com/dennisjooo",
    ariaLabel: "GitHub",
    icon: "github",
  },
  {
    href: "https://www.linkedin.com/in/dennisjooo/",
    ariaLabel: "LinkedIn",
    icon: "linkedin",
  },
];

export function resolveContactLinks(
  contacts?: ContactLinkData[],
): ContactLinkData[] {
  return contacts?.length ? contacts : defaultContactLinks;
}
