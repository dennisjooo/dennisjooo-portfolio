import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

export const CONTACT_ICON_OPTIONS = [
  { value: "mail", label: "Email" },
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
] as const;

export const CONTACT_ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};
