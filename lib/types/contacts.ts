export const CONTACT_ICON_NAMES = [
  "mail",
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "website",
] as const;

export type ContactIconName = (typeof CONTACT_ICON_NAMES)[number];

export interface ContactLinkData {
  href: string;
  ariaLabel: string;
  icon: ContactIconName;
}
