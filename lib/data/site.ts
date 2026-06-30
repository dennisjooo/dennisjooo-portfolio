import "server-only";
import { unstable_cache } from "next/cache";
import { desc, asc } from "drizzle-orm";
import {
  db,
  siteConfig,
  workExperiences,
  contacts,
  type SiteConfig,
} from "@/lib/db";
import { CACHE_CONFIG } from "@/lib/constants/cache";
import type { TimelineItemData } from "@/lib/types/workExperience";
import type { ContactLinkData } from "@/lib/types/contacts";

export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig | null> => {
    try {
      const [config] = await db.select().from(siteConfig).limit(1);
      return config ?? null;
    } catch (error) {
      console.error("Failed to fetch site config", error);
      return null;
    }
  },
  ["site-config"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["site-config"] },
);

export const getWorkExperience = unstable_cache(
  async (): Promise<TimelineItemData[]> => {
    try {
      const experiences = await db
        .select()
        .from(workExperiences)
        .orderBy(asc(workExperiences.order), desc(workExperiences.createdAt));

      return experiences.map((exp) => ({
        ...exp,
        responsibilities: exp.responsibilities ?? [],
        order: exp.order ?? undefined,
      }));
    } catch (error) {
      console.error("Failed to fetch work experience", error);
      return [];
    }
  },
  ["work-experience"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["work-experience"] },
);

export const getContacts = unstable_cache(
  async (): Promise<ContactLinkData[]> => {
    try {
      const contactItems = await db
        .select()
        .from(contacts)
        .orderBy(asc(contacts.order), desc(contacts.createdAt));

      return contactItems.map((contact) => ({
        href: contact.href,
        ariaLabel: contact.label,
        icon: contact.icon,
      }));
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      return [];
    }
  },
  ["contacts"],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: ["contacts"] },
);

export function buildAboutContent(config: SiteConfig | null) {
  if (!config) return undefined;

  return {
    intro: config.aboutIntro ?? "",
    experience: config.aboutExperience ?? "",
    personal: config.aboutPersonal ?? "",
    outro: config.aboutOutro ?? "",
  };
}
