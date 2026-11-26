import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { CONTACT_ICON_NAMES, type ContactIconName } from "@/lib/types/contacts";

const CONTACT_ICON_LABELS: Record<ContactIconName, string> = {
  mail: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "Twitter/X",
  instagram: "Instagram",
  youtube: "YouTube",
  website: "Website",
};

export const CONTACT_ICON_OPTIONS = CONTACT_ICON_NAMES.map((value) => ({
  value,
  label: CONTACT_ICON_LABELS[value],
}));

export const CONTACT_ICON_MAP: Record<
  ContactIconName,
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
