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
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/constants/cache";
import type { TimelineItemData } from "@/lib/types/workExperience";
import type { ContactLinkData } from "@/lib/types/contacts";
import {
  resolveAboutContent,
  type AboutContent,
} from "@/lib/content/aboutContent";

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
  [CACHE_TAGS.siteConfig],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.siteConfig] },
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
  [CACHE_TAGS.workExperience],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.workExperience] },
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
  [CACHE_TAGS.contacts],
  { revalidate: CACHE_CONFIG.REVALIDATE, tags: [CACHE_TAGS.contacts] },
);

export function buildAboutContent(config: SiteConfig | null): AboutContent {
  return resolveAboutContent(config?.aboutSections);
}
