import { asc, desc } from "drizzle-orm";
import {
  contacts,
  workExperiences,
  type Contact,
  type WorkExperience,
} from "./schema";
import type { TimelineItemData } from "@/lib/types/workExperience";
import type { ContactLinkData } from "@/lib/types/contacts";

export function workExperienceOrderBy() {
  return [asc(workExperiences.order), desc(workExperiences.createdAt)] as const;
}

export function contactsOrderBy() {
  return [asc(contacts.order), desc(contacts.createdAt)] as const;
}

export function normalizeResponsibilities(
  responsibilities: string[] | null | undefined,
): string[] {
  return responsibilities ?? [];
}

export function toTimelineItem(exp: WorkExperience): TimelineItemData {
  return {
    ...exp,
    responsibilities: normalizeResponsibilities(exp.responsibilities),
    order: exp.order ?? undefined,
  };
}

export function toContactLink(contact: Contact): ContactLinkData {
  return {
    href: contact.href,
    ariaLabel: contact.label,
    icon: contact.icon,
  };
}
